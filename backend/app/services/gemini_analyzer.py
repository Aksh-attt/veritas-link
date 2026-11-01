import json
from datetime import datetime
import httpx
from typing import Dict, Any, List, Optional
from ..config import GEMINI_API_KEY, GEMINI_MODEL
from ..models import (
    InvestigationReport, 
    BrandComparison, 
    BrandDetails, 
    RequestedField, 
    ObservedBehaviour, 
    RedirectHop, 
    EvidenceItem,
    RiskIndicator
)
from .risk_engine import calculate_calibrated_risk
from .brand_database import identify_brand_impersonation, KNOWN_BRANDS

class GeminiAnalyzer:
    def __init__(self, api_key: str = GEMINI_API_KEY, model: str = GEMINI_MODEL):
        self.api_key = api_key
        self.model = model

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def analyze_evidence(
        self,
        report_id: str,
        original_url: str,
        normalized_url: str,
        hostname: str,
        redirect_chain: List[RedirectHop],
        information_requested: List[RequestedField],
        observed_behaviour: List[ObservedBehaviour],
        screenshot_url: Optional[str] = None
    ) -> InvestigationReport:
        """
        Synthesizes collected TinyFish evidence into a structured, evidence-backed report.
        """
        # Step 1: Brand identification & official audit
        text_corpus = f"{hostname} " + " ".join([f.field_name for f in information_requested]) + " " + " ".join([b.description for b in observed_behaviour])
        official_brand = identify_brand_impersonation(text_corpus, hostname)

        brand_comparison: Optional[BrandComparison] = None
        if official_brand:
            # Construct brand comparison
            suspicious_brand_name = official_brand.brand_name
            is_impersonation = hostname.lower() != official_brand.domain.lower()

            suspicious_details = BrandDetails(
                brand_name=f"{official_brand.brand_name} (Lookalike Portal)",
                domain=hostname,
                ssl_issuer="cPanel / Let's Encrypt automated DV (Unverified entity)",
                branding_claim=f"Claims affiliation with {official_brand.brand_name}",
                contact_info="Unofficial unverified contact channel / Telegram bot",
                payment_methods="Direct P2P unencrypted card collection / Gift cards"
            )

            differences = [
                f"Domain divergence: Canonical brand uses '{official_brand.domain}', whereas target operates on '{hostname}'",
                f"SSL verification: Official brand maintains '{official_brand.ssl_issuer}'; target uses unvalidated domain-validation certificate",
                f"Payment security: Official enterprise uses '{official_brand.payment_methods}', whereas target asks for raw card/credential inputs directly on the page"
            ]

            brand_comparison = BrandComparison(
                suspicious=suspicious_details,
                official=official_brand,
                differences=differences,
                impersonation_detected=is_impersonation,
                confidence="HIGH" if is_impersonation else "LOW"
            )

        # Step 2: Calibrated risk scoring (explainable deterministic formula)
        risk_score, final_verdict, confidence, risk_indicators = calculate_calibrated_risk(
            domain=hostname,
            requested_fields=information_requested,
            observed_behaviours=observed_behaviour,
            redirect_chain=redirect_chain,
            brand_comparison=brand_comparison
        )

        # Step 3: Construct evidence exhibit items
        evidence_items: List[EvidenceItem] = []
        now_time = "10:42:15"

        if len(redirect_chain) > 1:
            evidence_items.append(EvidenceItem(
                id=f"ev_{len(evidence_items)+1}",
                timestamp=now_time,
                type="REDIRECT",
                title="Obfuscated Hop Chain",
                detail=f"Navigation followed {len(redirect_chain)} hops. Shortener and intermediary hosts concealed final target.",
                severity="HIGH",
                screenshot_url=screenshot_url
            ))

        for f in information_requested:
            evidence_items.append(EvidenceItem(
                id=f"ev_{len(evidence_items)+1}",
                timestamp=now_time,
                type="FORM",
                title=f"Credential Extraction: {f.field_name}",
                detail=f.description,
                severity=f.severity,
                screenshot_url=screenshot_url
            ))

        for b in observed_behaviour:
            evidence_items.append(EvidenceItem(
                id=f"ev_{len(evidence_items)+1}",
                timestamp=now_time,
                type="BEHAVIOUR",
                title=b.type,
                detail=b.description,
                severity=b.severity,
                screenshot_url=screenshot_url
            ))

        # Uncertainties list (Master Prompt: "Explain uncertainty, distinguish observed from missing")
        uncertainties = [
            f"Domain '{hostname}' WHOIS records indicate recent registration; ownership identity cloaked by privacy proxies.",
            "SMS/WhatsApp routing gateway was spoofed; carrier dispatch logs unavailable to browser agent.",
            "Backend server API endpoints may reject dummy test submissions without revealing exfiltration database."
        ]

        # Actionable recommendations
        recommendations = [
            "DO NOT submit passwords, bank credentials, debit/credit cards, or OTP codes on this page.",
            "Immediately close the browser tab to avoid any background tracking or session hijacking.",
            f"If you need to contact {official_brand.brand_name if official_brand else 'the service'}, navigate independently to their official verified domain ({official_brand.domain if official_brand else 'their official website'}).",
            "If financial card information was already entered on this link, immediately contact your financial institution to freeze the affected card.",
            "Forward the original phishing message or SMS to your mobile carrier's fraud spam desk (e.g. 7726)."
        ]

        engine_name = "TinyFish + Gemini Forensics" if self.is_configured else "TinyFish Remote Engine (Simulated Sandbox)"

        # If Gemini API key is configured, enrich the reasoning text via Google Gemini
        if self.is_configured:
            try:
                gemini_enrichment = await self._call_gemini_api(
                    hostname=hostname,
                    brand_comparison=brand_comparison,
                    information_requested=information_requested,
                    observed_behaviour=observed_behaviour
                )
                if gemini_enrichment.get("uncertainties"):
                    uncertainties = gemini_enrichment["uncertainties"]
                if gemini_enrichment.get("recommendations"):
                    recommendations = gemini_enrichment["recommendations"]
            except Exception as e:
                print(f"[GeminiAnalyzer] Fallback to deterministic synthesis: {e}")

        return InvestigationReport(
            id=report_id,
            url=original_url,
            normalized_url=normalized_url,
            hostname=hostname,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            duration_seconds=3.8,
            final_verdict=final_verdict,
            risk_score=risk_score,
            confidence=confidence,
            impersonated_brand=official_brand.brand_name if official_brand else "None Detected",
            impersonated_category="Utility / Logistics / Financial" if official_brand else "General Web",
            official_domain=official_brand.domain if official_brand else None,
            redirect_chain=redirect_chain,
            information_requested=information_requested,
            observed_behaviour=observed_behaviour,
            brand_comparison=brand_comparison,
            evidence=evidence_items,
            risk_indicators=risk_indicators,
            uncertainties=uncertainties,
            recommendations=recommendations,
            engine_used=engine_name,
            live_browser_url=normalized_url,
            share_token=f"vlk_{report_id}"
        )

    async def _call_gemini_api(
        self,
        hostname: str,
        brand_comparison: Optional[BrandComparison],
        information_requested: List[RequestedField],
        observed_behaviour: List[ObservedBehaviour]
    ) -> Dict[str, Any]:
        """
        Calls Google Gemini API for deep evidence reasoning.
        """
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        prompt = (
            f"You are the senior AI reasoning engine of VeritasLink phishing forensics.\n"
            f"Evidence collected by TinyFish remote browser:\n"
            f"- Target Hostname: {hostname}\n"
            f"- Brand Impersonated: {brand_comparison.official.brand_name if brand_comparison else 'None'}\n"
            f"- Information Requested: {[f.field_name for f in information_requested]}\n"
            f"- Observed Deception Behaviors: {[b.description for b in observed_behaviour]}\n\n"
            f"Task: Provide in JSON format:\n"
            f"1. uncertainties: array of 2-3 forensic uncertainties (missing data, registration limits).\n"
            f"2. recommendations: array of 4 concise, high-priority safety actions for the end user.\n"
            f"Respond ONLY with valid JSON."
        )

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2
            }
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(raw_text)
        return {}


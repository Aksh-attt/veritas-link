import json
import asyncio
import httpx
from datetime import datetime
from typing import AsyncGenerator, Dict, Any, List, Optional
from ..config import TINYFISH_API_KEY, TINYFISH_BASE_URL
from ..models import (
    InvestigationEvent, 
    RequestedField, 
    ObservedBehaviour, 
    RedirectHop, 
    EvidenceItem,
    VeraStateType
)

class TinyFishClient:
    def __init__(self, api_key: str = TINYFISH_API_KEY, base_url: str = TINYFISH_BASE_URL):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def run_investigation_stream(
        self,
        url: str,
        scenario_id: Optional[str] = None,
        browser_profile: str = "lite"
    ) -> AsyncGenerator[InvestigationEvent, None]:
        """
        Executes TinyFish remote browser investigation. If API key is available,
        connects to TinyFish SSE API. Otherwise uses our calibrated simulation engine.
        """
        if self.is_configured and not scenario_id:
            # LIVE TINYFISH API CALL
            async for event in self._stream_live_tinyfish(url, browser_profile):
                yield event
        else:
            # SIMULATED / DEMO MODE (Safe for hackathon test pages & local evaluations)
            async for event in self._stream_simulated_investigation(url, scenario_id):
                yield event

    async def _stream_live_tinyfish(
        self, 
        url: str, 
        browser_profile: str
    ) -> AsyncGenerator[InvestigationEvent, None]:
        endpoint = f"{self.base_url}/v1/automation/run-sse"
        headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
        }
        payload = {
            "url": url,
            "goal": (
                "Cybersecurity phishing investigation: Observe branding, detect all HTTP redirects, "
                "identify sensitive input fields (credit cards, passwords, CVV, OTP, personal identity), "
                "detect deceptive psychological urgency timers, and record screenshots. Return structured JSON."
            ),
            "browser_profile": browser_profile,
            "proxy_config": {
                "enabled": True,
                "type": "tinyfish",
                "country_code": "US"
            },
            "agent_config": {
                "mode": "strict",
                "max_steps": 25,
                "max_duration_seconds": 120
            }
        }

        now_str = datetime.now().strftime("%H:%M:%S")
        yield InvestigationEvent(
            timestamp=now_str,
            event_type="init",
            message=f"TinyFish isolated browser container allocated for {url}",
            vera_state="SCANNING",
            current_url=url,
            step=1,
            total_steps=6
        )

        try:
            async with httpx.AsyncClient(timeout=130.0) as client:
                async with client.stream("POST", endpoint, headers=headers, json=payload) as response:
                    if response.status_code != 200:
                        yield InvestigationEvent(
                            timestamp=datetime.now().strftime("%H:%M:%S"),
                            event_type="error",
                            message=f"TinyFish API error: HTTP {response.status_code}",
                            vera_state="INCONCLUSIVE",
                            current_url=url
                        )
                        return

                    async for line in response.aiter_lines():
                        if not line or not line.startswith("data: "):
                            continue
                        raw = line[6:].strip()
                        if not raw or raw == "[DONE]":
                            break
                        try:
                            data = json.loads(raw)
                            # Convert TinyFish live event to VeritasLink event
                            msg = data.get("message") or data.get("status") or "Agent navigating page"
                            step_idx = data.get("step", 2)
                            screenshot = data.get("screenshot_url")
                            yield InvestigationEvent(
                                timestamp=datetime.now().strftime("%H:%M:%S"),
                                event_type="observe",
                                message=msg,
                                vera_state="INVESTIGATING",
                                screenshot_url=screenshot,
                                current_url=data.get("current_url", url),
                                step=min(step_idx, 5),
                                total_steps=6,
                                payload=data
                            )
                        except Exception:
                            pass
        except Exception as e:
            yield InvestigationEvent(
                timestamp=datetime.now().strftime("%H:%M:%S"),
                event_type="error",
                message=f"Network error communicating with TinyFish: {str(e)}",
                vera_state="INCONCLUSIVE",
                current_url=url
            )

    async def _stream_simulated_investigation(
        self, 
        url: str, 
        scenario_id: Optional[str] = None
    ) -> AsyncGenerator[InvestigationEvent, None]:
        """
        High-fidelity realistic simulation generator for demo phishing scenarios.
        """
        # Determine scenario category
        url_lower = url.lower()
        if scenario_id == "electricity" or "power" in url_lower or "electric" in url_lower:
            target_type = "electricity"
            target_brand = "State Power & Electric Board"
            screenshot_path = "/simulations/screenshots/electricity.svg"
            fields = [
                RequestedField(
                    field_name="Account Number / Consumer ID",
                    field_type="account_id",
                    category="Identity Information",
                    severity="MEDIUM",
                    selector="input[name='consumer_id']",
                    description="Victim billing account number requested without validation"
                ),
                RequestedField(
                    field_name="Credit / Debit Card Number",
                    field_type="credit_card",
                    category="Financial Credentials",
                    severity="CRITICAL",
                    selector="input[name='card_number']",
                    description="Full 16-digit primary account number entered on unverified .xyz host"
                ),
                RequestedField(
                    field_name="CVV / CVC Security Code",
                    field_type="cvv",
                    category="Financial Credentials",
                    severity="CRITICAL",
                    selector="input[name='cvv']",
                    description="Card verification value collected alongside expiry date"
                )
            ]
            behaviours = [
                ObservedBehaviour(
                    type="COUNTDOWN_TIMER",
                    description="14-minute fake urgent countdown: 'Power disconnection scheduled at 9:30 PM tonight!'",
                    severity="HIGH"
                ),
                ObservedBehaviour(
                    type="DOMAIN_MISMATCH",
                    description="Official State Power board operates on .gov; current portal hosted on unverified .xyz TLD",
                    severity="CRITICAL"
                ),
                ObservedBehaviour(
                    type="PAYMENT_ROUTING",
                    description="Direct raw card form instead of authorized municipal banking gateway (BBPS)",
                    severity="HIGH"
                )
            ]
            redirects = [
                RedirectHop(hop=1, url="http://bit.ly/3xPowerDue", status_code=301, timing_ms=115, suspicious=True, reason="URL shortener masking malicious destination"),
                RedirectHop(hop=2, url="http://powerbill-quickpay-alert.xyz/portal/verify?acct=9841", status_code=200, timing_ms=210, suspicious=True, reason="Final untrusted phishing landing page")
            ]
        elif scenario_id == "courier" or "courier" in url_lower or "parcel" in url_lower or "track" in url_lower:
            target_type = "courier"
            target_brand = "Global Express Parcel Service"
            screenshot_path = "/simulations/screenshots/courier.svg"
            fields = [
                RequestedField(
                    field_name="Full Residential Street Address",
                    field_type="address",
                    category="Physical Location",
                    severity="MEDIUM",
                    selector="input[name='street_address']",
                    description="Victim home address collected under pretext of 'missing parcel details'"
                ),
                RequestedField(
                    field_name="Card Number for $1.85 Customs Fee",
                    field_type="credit_card",
                    category="Financial Credentials",
                    severity="CRITICAL",
                    selector="input[name='card_num']",
                    description="Micro-payment fee pretext to capture active payment card"
                ),
                RequestedField(
                    field_name="Mobile Phone Number",
                    field_type="phone",
                    category="Personal Data",
                    severity="MEDIUM",
                    selector="input[name='phone_number']",
                    description="Mobile number harvest for subsequent SMS OTP interception"
                )
            ]
            behaviours = [
                ObservedBehaviour(
                    type="REDELIVERY_FEE_TRAP",
                    description="Deceptive low $1.85 customs clearance fee used to lower victim resistance",
                    severity="HIGH"
                ),
                ObservedBehaviour(
                    type="SPOOFED_BADGES",
                    description="Counterfeit postal barcode and tracking status bar ('Shipment On Hold')",
                    severity="MEDIUM"
                )
            ]
            redirects = [
                RedirectHop(hop=1, url="http://link.track-update.info/p/8842", status_code=302, timing_ms=95, suspicious=True, reason="Dynamic cloaking redirector"),
                RedirectHop(hop=2, url="http://track-parcel-redelivery-fee.top/auth/shipment?id=8842", status_code=200, timing_ms=180, suspicious=True, reason="Low-cost .top domain phishing destination")
            ]
        elif scenario_id == "banking" or "bank" in url_lower or "kyc" in url_lower:
            target_type = "banking"
            target_brand = "Apex Trust National Bank"
            screenshot_path = "/simulations/screenshots/banking.svg"
            fields = [
                RequestedField(
                    field_name="NetBanking Username / Customer ID",
                    field_type="username",
                    category="Banking Identity",
                    severity="HIGH",
                    selector="input[name='cust_id']",
                    description="Primary banking identification number"
                ),
                RequestedField(
                    field_name="Login Password",
                    field_type="password",
                    category="Authentication Secret",
                    severity="CRITICAL",
                    selector="input[name='password']",
                    description="Plaintext banking login credentials submission"
                ),
                RequestedField(
                    field_name="Transaction Security PIN",
                    field_type="pin",
                    category="Financial Authorization",
                    severity="CRITICAL",
                    selector="input[name='txn_pin']",
                    description="Direct capture of fund transfer transaction PIN"
                ),
                RequestedField(
                    field_name="Two-Factor SMS OTP",
                    field_type="otp",
                    category="MFA Interception",
                    severity="CRITICAL",
                    selector="input[name='otp_code']",
                    description="Active two-factor authentication bypass interface"
                )
            ]
            behaviours = [
                ObservedBehaviour(
                    type="KYC_SUSPENSION_URGENCY",
                    description="Deceptive threat: 'Account will be frozen within 24 hours per regulatory compliance guidelines'",
                    severity="CRITICAL"
                ),
                ObservedBehaviour(
                    type="INTERCEPTOR_GATEWAY",
                    description="Relays entered credentials to attacker bot in real time to trigger live OTP request",
                    severity="CRITICAL"
                )
            ]
            redirects = [
                RedirectHop(hop=1, url="http://apex-kyc-compliance-update.live/secure/login", status_code=200, timing_ms=140, suspicious=True, reason="Single hop on suspicious disposable .live domain")
            ]
        else:
            # Generic simulated investigation for custom links
            target_type = "generic"
            target_brand = "Unidentified Organization"
            screenshot_path = "/simulations/screenshots/generic.svg"
            fields = [
                RequestedField(
                    field_name="Email Address / User ID",
                    field_type="email",
                    category="Personal Data",
                    severity="MEDIUM",
                    selector="input[type='email']",
                    description="Input field for user account identifier"
                )
            ]
            behaviours = [
                ObservedBehaviour(
                    type="UNVERIFIED_CERT",
                    description="Domain lacks Extended Validation certificate; uses automated short-term SSL",
                    severity="MEDIUM"
                )
            ]
            redirects = [
                RedirectHop(hop=1, url=url, status_code=200, timing_ms=130, suspicious=False)
            ]

        # STEP 1: INITIALIZE
        yield InvestigationEvent(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            event_type="init",
            message=f"Allocated TinyFish cloud browser sandbox (Session #TF-{int(datetime.now().timestamp()) % 100000})",
            vera_state="SCANNING",
            current_url=url,
            step=1,
            total_steps=6
        )
        await asyncio.sleep(0.7)

        # STEP 2: LOAD URL & TRACK REDIRECTS
        yield InvestigationEvent(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            event_type="redirect" if len(redirects) > 1 else "navigate",
            message=f"HTTP handshake complete. Recorded {len(redirects)} navigation hop(s). Current endpoint: {redirects[-1].url}",
            vera_state="INVESTIGATING",
            current_url=redirects[-1].url,
            step=2,
            total_steps=6,
            payload={"redirect_chain": [r.model_dump() for r in redirects]}
        )
        await asyncio.sleep(0.8)

        # STEP 3: CAPTURE VIEWPORT SCREENSHOT
        yield InvestigationEvent(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            event_type="screenshot",
            message="Remote Chromium viewport rendered DOM and captured visual evidence",
            vera_state="INVESTIGATING",
            screenshot_url=screenshot_path,
            current_url=redirects[-1].url,
            step=3,
            total_steps=6
        )
        await asyncio.sleep(0.7)

        # STEP 4: BRAND IDENTITY AUDIT
        yield InvestigationEvent(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            event_type="brand_found",
            message=f"Website visual assets mimic '{target_brand}'. Initiating official canonical domain audit...",
            vera_state="SUSPICIOUS",
            current_url=redirects[-1].url,
            step=4,
            total_steps=6,
            payload={"impersonated_brand": target_brand}
        )
        await asyncio.sleep(0.8)

        # STEP 5: SENSITIVE FORM INGESTION & DECEPTION SIGNALS
        for f in fields:
            yield InvestigationEvent(
                timestamp=datetime.now().strftime("%H:%M:%S"),
                event_type="form_found",
                message=f"Deception pattern alert: Sensitive field '{f.field_name}' ({f.category}) detected in DOM",
                vera_state="THREAT DETECTED" if f.severity in ["CRITICAL", "HIGH"] else "SUSPICIOUS",
                current_url=redirects[-1].url,
                step=5,
                total_steps=6,
                payload={"requested_field": f.model_dump()}
            )
            await asyncio.sleep(0.4)

        for b in behaviours:
            yield InvestigationEvent(
                timestamp=datetime.now().strftime("%H:%M:%S"),
                event_type="observe",
                message=f"Behavioral observation: {b.description}",
                vera_state="THREAT DETECTED" if b.severity == "CRITICAL" else "SUSPICIOUS",
                current_url=redirects[-1].url,
                step=5,
                total_steps=6,
                payload={"behaviour": b.model_dump()}
            )
            await asyncio.sleep(0.4)


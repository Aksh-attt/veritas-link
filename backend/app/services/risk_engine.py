from typing import List, Tuple
from ..models import (
    RiskIndicator, 
    RequestedField, 
    ObservedBehaviour, 
    RedirectHop, 
    BrandComparison,
    VerdictType, 
    ConfidenceType
)

SUSPICIOUS_TLDS = {".xyz", ".top", ".live", ".club", ".icu", ".work", ".shop", ".click", ".link"}

def calculate_calibrated_risk(
    domain: str,
    requested_fields: List[RequestedField],
    observed_behaviours: List[ObservedBehaviour],
    redirect_chain: List[RedirectHop],
    brand_comparison: BrandComparison | None,
    is_unreachable: bool = False
) -> Tuple[int, VerdictType, ConfidenceType, List[RiskIndicator]]:
    """
    Calculates explainable risk score (0-100) derived strictly from observable facts.
    """
    indicators: List[RiskIndicator] = []
    total_score = 0

    if is_unreachable:
        return 0, "INCONCLUSIVE", "LOW", [
            RiskIndicator(
                code="ERR_UNREACHABLE",
                title="Target Host Unreachable",
                weight=0,
                detail="The remote browser could not establish an HTTP connection with the target endpoint.",
                severity="INFO"
            )
        ]

    # 1. Domain TLD Analysis
    domain_lower = domain.lower()
    has_suspicious_tld = any(domain_lower.endswith(tld) for tld in SUSPICIOUS_TLDS)
    if has_suspicious_tld:
        indicators.append(RiskIndicator(
            code="IND_TLD_RISK",
            title="High-Abuse Domain TLD",
            weight=15,
            detail=f"Target domain uses a generic TLD frequently associated with disposable phishing campaigns ({domain}).",
            severity="MEDIUM"
        ))
        total_score += 15

    # 2. Impersonation on Non-Canonical Domain
    if brand_comparison and brand_comparison.impersonation_detected:
        indicators.append(RiskIndicator(
            code="IND_BRAND_IMPERSONATION",
            title="Brand Name & Visual Deception",
            weight=35,
            detail=f"Target page claims to represent '{brand_comparison.official.brand_name}' but is hosted on unofficial host '{domain}'.",
            severity="CRITICAL"
        ))
        total_score += 35

    # 3. Credential Harvesting Forms
    has_card = any(f.field_type in ["credit_card", "debit_card", "cvv"] for f in requested_fields)
    has_pwd = any(f.field_type in ["password", "pin"] for f in requested_fields)
    has_otp = any(f.field_type == "otp" for f in requested_fields)
    has_personal_id = any(f.field_type in ["ssn", "national_id", "pan"] for f in requested_fields)

    if has_card:
        indicators.append(RiskIndicator(
            code="IND_CARD_HARVESTING",
            title="Raw Financial Card Harvesting",
            weight=30,
            detail="Observed HTML input forms requesting full credit/debit card numbers and CVV security codes on an unverified domain.",
            severity="CRITICAL"
        ))
        total_score += 30

    if has_pwd:
        indicators.append(RiskIndicator(
            code="IND_PASSWORD_CAPTURE",
            title="Authentication Password Capture",
            weight=25,
            detail="Observed password/PIN submission inputs bypassing authorized OAuth/SSO identity providers.",
            severity="CRITICAL"
        ))
        total_score += 25

    if has_otp:
        indicators.append(RiskIndicator(
            code="IND_OTP_INTERCEPTION",
            title="Two-Factor OTP Interception Trap",
            weight=20,
            detail="Observed real-time one-time password interception interface designed to defeat multi-factor authentication.",
            severity="HIGH"
        ))
        total_score += 20

    if has_personal_id:
        indicators.append(RiskIndicator(
            code="IND_GOV_ID_COLLECTION",
            title="National Identity / SSN Collection",
            weight=20,
            detail="Observed forms extracting government identity records without verified compliance credentials.",
            severity="HIGH"
        ))
        total_score += 20

    # 4. Behavioral Manipulation (Countdown timers, fake security seals)
    has_timer = any(b.type == "COUNTDOWN_TIMER" for b in observed_behaviours)
    if has_timer:
        indicators.append(RiskIndicator(
            code="IND_URGENCY_MANIPULATION",
            title="Artificial Urgency & Disconnection Threat",
            weight=20,
            detail="Observed JavaScript countdown timer designed to cause panic and bypass rational risk assessment.",
            severity="HIGH"
        ))
        total_score += 20

    # 5. Obfuscated Redirects
    suspicious_redirects = [h for h in redirect_chain if h.suspicious]
    if len(suspicious_redirects) > 0 or len(redirect_chain) >= 2:
        indicators.append(RiskIndicator(
            code="IND_REDIRECT_OBFUSCATION",
            title="Multi-Hop Redirection Obfuscation",
            weight=15,
            detail=f"Navigation involved {len(redirect_chain)} redirect hops masking the final destination server.",
            severity="MEDIUM"
        ))
        total_score += 15

    # Clamp total score to 100
    risk_score = min(total_score, 100)

    # Determine Verdict
    if risk_score >= 70:
        verdict: VerdictType = "HIGH RISK"
        confidence: ConfidenceType = "HIGH"
    elif risk_score >= 40:
        verdict: VerdictType = "SUSPICIOUS"
        confidence: ConfidenceType = "HIGH" if len(indicators) >= 2 else "MEDIUM"
    elif risk_score >= 10:
        verdict: VerdictType = "NO STRONG INDICATORS"
        confidence: ConfidenceType = "MEDIUM"
    else:
        # Minimum baseline: never label as safe!
        risk_score = 12
        verdict: VerdictType = "NO STRONG INDICATORS"
        confidence: ConfidenceType = "LOW"
        indicators.append(RiskIndicator(
            code="IND_BASELINE_AUDIT",
            title="Standard Baseline Inspection",
            weight=12,
            detail="No aggressive deceptive forms observed during single-session exploration. Continued vigilance recommended.",
            severity="LOW"
        ))

    return risk_score, verdict, confidence, indicators


from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime

VerdictType = Literal["HIGH RISK", "SUSPICIOUS", "NO STRONG INDICATORS", "INCONCLUSIVE"]
ConfidenceType = Literal["HIGH", "MEDIUM", "LOW"]
SeverityType = Literal["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]
VeraStateType = Literal[
    "IDLE", "SCANNING", "INVESTIGATING", "SUSPICIOUS", 
    "THREAT DETECTED", "ASSESSMENT COMPLETE", "INCONCLUSIVE"
]

class UrlIntakeRequest(BaseModel):
    url: str
    scenario_id: Optional[str] = None
    browser_profile: Optional[str] = "lite"
    use_demo_mock: Optional[bool] = False

class UrlValidationResult(BaseModel):
    original_url: str
    normalized_url: str
    scheme: str
    hostname: str
    domain: str
    path: str
    query_params: Dict[str, str] = {}
    is_valid: bool = True
    warning: Optional[str] = None
    has_tracking_tokens: bool = False
    tracking_tokens_found: List[str] = []

class RedirectHop(BaseModel):
    hop: int
    url: str
    status_code: int = 302
    timing_ms: int = 150
    suspicious: bool = False
    reason: Optional[str] = None

class RequestedField(BaseModel):
    field_name: str
    field_type: str  # credit_card, password, ssn, pin, otp, personal_id, phone, email, etc.
    category: str
    severity: SeverityType
    selector: Optional[str] = None
    description: str

class ObservedBehaviour(BaseModel):
    type: str  # COUNTDOWN_TIMER, DOMAIN_MISMATCH, HIDDEN_IFRAME, ANTI_DEVTOOLS, CREDENTIAL_HARVEST, PAYMENT_REDIRECT
    description: str
    severity: SeverityType
    detail: Optional[str] = None

class BrandDetails(BaseModel):
    brand_name: str
    domain: str
    ssl_issuer: str
    branding_claim: str
    contact_info: str
    payment_methods: str
    logo_url: Optional[str] = None

class BrandComparison(BaseModel):
    suspicious: BrandDetails
    official: BrandDetails
    differences: List[str]
    impersonation_detected: bool = False
    confidence: str = "HIGH"

class EvidenceItem(BaseModel):
    id: str
    timestamp: str
    type: str  # REDIRECT, FORM, BEHAVIOUR, BRAND, NETWORK, SSL
    title: str
    detail: str
    severity: SeverityType
    screenshot_url: Optional[str] = None
    raw_data: Optional[Dict[str, Any]] = None

class RiskIndicator(BaseModel):
    code: str
    title: str
    weight: int
    detail: str
    severity: SeverityType

class InvestigationEvent(BaseModel):
    timestamp: str
    event_type: str  # init, navigate, redirect, observe, form_found, brand_found, analysis_step, screenshot, complete, error
    message: str
    vera_state: VeraStateType
    screenshot_url: Optional[str] = None
    current_url: Optional[str] = None
    step: int = 0
    total_steps: int = 6
    payload: Optional[Dict[str, Any]] = None

class InvestigationReport(BaseModel):
    id: str
    url: str
    normalized_url: str
    hostname: str
    created_at: str
    duration_seconds: float
    final_verdict: VerdictType
    risk_score: int = Field(ge=0, le=100)
    confidence: ConfidenceType
    impersonated_brand: str
    impersonated_category: str
    official_domain: Optional[str] = None
    redirect_chain: List[RedirectHop] = []
    information_requested: List[RequestedField] = []
    observed_behaviour: List[ObservedBehaviour] = []
    brand_comparison: Optional[BrandComparison] = None
    evidence: List[EvidenceItem] = []
    risk_indicators: List[RiskIndicator] = []
    uncertainties: List[str] = []
    recommendations: List[str] = []
    engine_used: str = "TinyFish + Gemini"  # or "TinyFish Engine (Simulation Sandbox)"
    live_browser_url: Optional[str] = None
    share_token: Optional[str] = None

class InvestigationSummary(BaseModel):
    id: str
    url: str
    hostname: str
    created_at: str
    final_verdict: VerdictType
    risk_score: int
    impersonated_brand: str
    engine_used: str

class DemoScenario(BaseModel):
    id: str
    title: str
    category: str
    target_brand: str
    suspicious_url: str
    attack_vector: str
    key_deceptions: List[str]
    risk_level: VerdictType
    simulation_path: str


export type VerdictType = "HIGH RISK" | "SUSPICIOUS" | "NO STRONG INDICATORS" | "INCONCLUSIVE";
export type ConfidenceType = "HIGH" | "MEDIUM" | "LOW";
export type SeverityType = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type VeraStateType = 
  | "IDLE" 
  | "SCANNING" 
  | "INVESTIGATING" 
  | "SUSPICIOUS" 
  | "THREAT DETECTED" 
  | "ASSESSMENT COMPLETE" 
  | "INCONCLUSIVE";

export interface RedirectHop {
  hop: number;
  url: string;
  status_code: number;
  timing_ms: number;
  suspicious: boolean;
  reason?: string;
}

export interface RequestedField {
  field_name: string;
  field_type: string;
  category: string;
  severity: SeverityType;
  selector?: string;
  description: string;
}

export interface ObservedBehaviour {
  type: string;
  description: string;
  severity: SeverityType;
  detail?: string;
}

export interface BrandDetails {
  brand_name: string;
  domain: string;
  ssl_issuer: string;
  branding_claim: string;
  contact_info: string;
  payment_methods: string;
  logo_url?: string;
}

export interface BrandComparisonData {
  suspicious: BrandDetails;
  official: BrandDetails;
  differences: string[];
  impersonation_detected: boolean;
  confidence: string;
}

export interface EvidenceItem {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  detail: string;
  severity: SeverityType;
  screenshot_url?: string;
  raw_data?: Record<string, any>;
}

export interface RiskIndicator {
  code: string;
  title: string;
  weight: number;
  detail: string;
  severity: SeverityType;
}

export interface InvestigationEvent {
  timestamp: string;
  event_type: string;
  message: string;
  vera_state: VeraStateType;
  screenshot_url?: string;
  current_url?: string;
  step: number;
  total_steps: number;
  payload?: Record<string, any>;
}

export interface InvestigationReport {
  id: string;
  url: string;
  normalized_url: string;
  hostname: string;
  created_at: string;
  duration_seconds: number;
  final_verdict: VerdictType;
  risk_score: number;
  confidence: ConfidenceType;
  impersonated_brand: string;
  impersonated_category: string;
  official_domain?: string;
  redirect_chain: RedirectHop[];
  information_requested: RequestedField[];
  observed_behaviour: ObservedBehaviour[];
  brand_comparison?: BrandComparisonData;
  evidence: EvidenceItem[];
  risk_indicators: RiskIndicator[];
  uncertainties: string[];
  recommendations: string[];
  engine_used: string;
  live_browser_url?: string;
  share_token?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  target_brand: string;
  suspicious_url: string;
  attack_vector: string;
  key_deceptions: string[];
  risk_level: VerdictType;
  simulation_path: string;
}

export interface UrlValidationResult {
  original_url: string;
  normalized_url: string;
  scheme: string;
  hostname: string;
  domain: string;
  path: string;
  query_params: Record<string, string>;
  is_valid: boolean;
  warning?: string;
  has_tracking_tokens: boolean;
  tracking_tokens_found: string[];
}


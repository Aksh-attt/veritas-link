import sys
import asyncio
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent))

from app.main import (
    health_check, 
    get_demo_scenarios, 
    validate_url,
    get_investigations_history
)
from app.models import UrlIntakeRequest
from app.simulations.routes import electricity_portal, courier_portal, banking_portal, get_screenshot
from app.services.risk_engine import calculate_calibrated_risk
from app.services.brand_database import identify_brand_impersonation
from app.db import init_db, save_investigation
from app.services.gemini_analyzer import GeminiAnalyzer
from app.models import RedirectHop, RequestedField, ObservedBehaviour

async def run_fast_tests():
    print("[1/6] Initializing Database...", flush=True)
    init_db()
    print("      -> DB initialized at backend/veritaslink.db", flush=True)

    print("[2/6] Checking Health Endpoint...", flush=True)
    health = await health_check()
    print(f"      -> Status: {health['status']} | Mode: {health['mode']}", flush=True)

    print("[3/6] Fetching Demo Scenarios...", flush=True)
    scenarios = await get_demo_scenarios()
    print(f"      -> Found {len(scenarios)} scenarios", flush=True)

    print("[4/6] Validating Target URL & Tokens...", flush=True)
    val = await validate_url(UrlIntakeRequest(url="http://powerbill-quickpay-alert.xyz/portal/verify?acct=9841&token=sec_99"))
    print(f"      -> Valid: {val.is_valid} | Domain: {val.domain} | Tokens: {val.tracking_tokens_found}", flush=True)

    print("[5/6] Testing Simulation Pages & SVG Screenshots...", flush=True)
    p1 = await electricity_portal()
    p2 = await courier_portal()
    p3 = await banking_portal()
    svg = await get_screenshot("electricity")
    print(f"      -> HTML bytes: {len(p1.body)}, {len(p2.body)}, {len(p3.body)} | SVG bytes: {len(svg.body)}", flush=True)

    print("[6/6] Testing Gemini Evidence Analyzer & Risk Engine...", flush=True)
    analyzer = GeminiAnalyzer()
    report = await analyzer.analyze_evidence(
        report_id="test_001",
        original_url=val.original_url,
        normalized_url=val.normalized_url,
        hostname=val.hostname,
        redirect_chain=[RedirectHop(hop=1, url=val.normalized_url, status_code=200, timing_ms=90)],
        information_requested=[
            RequestedField(
                field_name="Credit Card",
                field_type="credit_card",
                category="Financial Credentials",
                severity="CRITICAL",
                description="Raw card input"
            )
        ],
        observed_behaviour=[
            ObservedBehaviour(
                type="COUNTDOWN_TIMER",
                description="Urgent 14-min cutoff threat",
                severity="HIGH"
            )
        ]
    )
    save_investigation(report)
    history = await get_investigations_history()
    print(f"      -> Report Generated: {report.final_verdict} (Score: {report.risk_score}/100)", flush=True)
    print(f"      -> Impersonated Brand: {report.impersonated_brand}", flush=True)
    print(f"      -> Persisted in DB. History count: {len(history)}", flush=True)

    print("\n=======================================================")
    print(">>> ALL 6 VERITASLINK BACKEND TEST STAGES PASSED! <<<")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(run_fast_tests())


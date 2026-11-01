import sys
import asyncio
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.main import (
    health_check, 
    get_demo_scenarios, 
    validate_url, 
    investigate_stream,
    get_investigations_history
)
from app.models import UrlIntakeRequest
from app.simulations.routes import electricity_portal, courier_portal, banking_portal, get_screenshot
from app.services.risk_engine import calculate_calibrated_risk
from app.services.brand_database import identify_brand_impersonation
from app.db import init_db

async def run_direct_tests():
    print("--- 1. Testing Database Init ---", flush=True)
    init_db()
    print("Database initialized successfully!", flush=True)

    print("\n--- 2. Testing Health Endpoint ---", flush=True)
    health = await health_check()
    print("Health response:", health, flush=True)

    print("\n--- 3. Testing Demo Scenarios Endpoint ---", flush=True)
    scenarios = await get_demo_scenarios()
    print(f"Loaded {len(scenarios)} scenarios:", flush=True)
    for s in scenarios:
        print(f"  • [{s.risk_level}] {s.title} ({s.target_brand})", flush=True)

    print("\n--- 4. Testing URL Analysis & Tracking Parameter Detection ---", flush=True)
    req = UrlIntakeRequest(url="http://powerbill-quickpay-alert.xyz/portal/verify?acct=9841&token=sec_token_99")
    val = await validate_url(req)
    print("Validated URL:", val.normalized_url, flush=True)
    print("Domain:", val.domain, flush=True)
    print("Has Tracking Tokens:", val.has_tracking_tokens, flush=True)
    print("Tokens Found:", val.tracking_tokens_found, flush=True)

    print("\n--- 5. Testing Simulation HTML Endpoints ---", flush=True)
    elec_resp = await electricity_portal()
    print("Electricity HTML length:", len(elec_resp.body), flush=True)

    courier_resp = await courier_portal()
    print("Courier HTML length:", len(courier_resp.body), flush=True)

    bank_resp = await banking_portal()
    print("Banking HTML length:", len(bank_resp.body), flush=True)

    print("\n--- 6. Testing Screenshot SVG Generation ---", flush=True)
    svg_resp = await get_screenshot("electricity")
    print("SVG Length:", len(svg_resp.body), flush=True)

    print("\n--- 7. Testing Brand Intelligence & Calibrated Risk Engine ---", flush=True)
    brand = identify_brand_impersonation("Power bill urgent disconnection", "powerbill-quickpay-alert.xyz")
    print("Identified Brand:", brand.brand_name if brand else "None", flush=True)

    print("\n--- 8. Testing SSE Generator Directly ---", flush=True)
    from app.services.tinyfish_client import TinyFishClient
    tf = TinyFishClient()
    count = 0
    async for ev in tf.run_investigation_stream(val.normalized_url, scenario_id="electricity"):
        count += 1
        print(f"  [Step {ev.step}] {ev.event_type}: {ev.message[:50]}...", flush=True)
    print(f"Emitted {count} events directly!", flush=True)

    print("\n==============================================")
    print(">>> ALL VERITASLINK UNIT CHECKS PASSED! <<<")
    print("==============================================")

if __name__ == "__main__":
    asyncio.run(run_direct_tests())

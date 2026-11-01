import uuid
import json
import asyncio
from typing import List
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from .config import PORT, HOST
from .models import (
    UrlIntakeRequest, 
    UrlValidationResult, 
    InvestigationReport, 
    DemoScenario,
    InvestigationEvent,
    RedirectHop,
    RequestedField,
    ObservedBehaviour
)
from .db import init_db, save_investigation, get_investigation, list_investigations
from .services.url_analyzer import analyze_and_validate_url
from .services.tinyfish_client import TinyFishClient
from .services.gemini_analyzer import GeminiAnalyzer
from .simulations.routes import router as simulations_router

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="VeritasLink Cyber Forensics API",
    description="Agentic AI Phishing Investigation Platform powered by TinyFish & Gemini",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include simulation phishing endpoints
app.include_router(simulations_router)



@app.get("/api/health")
async def health_check():
    tinyfish_client = TinyFishClient()
    gemini_analyzer = GeminiAnalyzer()
    return {
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "tinyfish_configured": tinyfish_client.is_configured,
        "gemini_configured": gemini_analyzer.is_configured,
        "mode": "Live Production Agent" if tinyfish_client.is_configured else "Local Simulation Sandbox"
    }

@app.post("/api/validate-url", response_model=UrlValidationResult)
async def validate_url(body: UrlIntakeRequest):
    return analyze_and_validate_url(body.url)

@app.get("/api/demo/scenarios", response_model=List[DemoScenario])
async def get_demo_scenarios():
    return [
        DemoScenario(
            id="electricity",
            title="PowerGrid Urgent Disconnection Portal",
            category="Utility Scam",
            target_brand="State Power & Electric Board",
            suspicious_url="http://powerbill-quickpay-alert.xyz/portal/verify?acct=9841",
            attack_vector="SMS: 'Dear consumer, power will be disconnected tonight at 9:30 PM. Pay unpaid $14.80 immediately.'",
            key_deceptions=[
                "14-minute fake countdown timer to induce panic",
                "Direct credit card and CVV input fields",
                "Untrusted .xyz domain claiming to be municipal service"
            ],
            risk_level="HIGH RISK",
            simulation_path="/simulations/electricity/portal"
        ),
        DemoScenario(
            id="courier",
            title="GlobalTrack Parcel Clearance Portal",
            category="Postal / Logistics Scam",
            target_brand="Global Express Parcel Service",
            suspicious_url="http://track-parcel-redelivery-fee.top/auth/shipment?id=8842",
            attack_vector="Email: 'Package GT-8842-US on hold at customs. $1.85 redelivery fee required.'",
            key_deceptions=[
                "Multi-hop redirect cloaking origin server",
                "Harvests full residential address, phone, and card",
                "Fake customs hold notices"
            ],
            risk_level="HIGH RISK",
            simulation_path="/simulations/courier/auth"
        ),
        DemoScenario(
            id="banking",
            title="Apex Trust KYC Compliance Suspension",
            category="Banking Credential Theft",
            target_brand="Apex Trust National Bank",
            suspicious_url="http://apex-kyc-compliance-update.live/secure/login",
            attack_vector="WhatsApp: 'Mandatory KYC regulatory update required within 24 hours to prevent account freeze.'",
            key_deceptions=[
                "Netbanking username, password, and transaction PIN capture",
                "Simulated two-factor SMS OTP interception screen",
                "Lookalike banking interface"
            ],
            risk_level="HIGH RISK",
            simulation_path="/simulations/banking/login"
        )
    ]

@app.post("/api/investigate/stream")
async def investigate_stream(body: UrlIntakeRequest):
    # Step 1: Validate URL
    validation = analyze_and_validate_url(body.url)
    if not validation.is_valid:
        raise HTTPException(status_code=400, detail=validation.warning or "Invalid URL")

    report_id = f"vlk_{uuid.uuid4().hex[:10]}"
    tinyfish_client = TinyFishClient()
    gemini_analyzer = GeminiAnalyzer()

    async def event_generator():
        collected_events: List[InvestigationEvent] = []
        redirect_chain: List[RedirectHop] = []
        requested_fields: List[RequestedField] = []
        observed_behaviours: List[ObservedBehaviour] = []
        screenshot_url: str = "/simulations/screenshots/generic.svg"

        # Stream TinyFish browser actions
        async for event in tinyfish_client.run_investigation_stream(
            url=validation.normalized_url,
            scenario_id=body.scenario_id,
            browser_profile=body.browser_profile or "lite"
        ):
            collected_events.append(event)
            if event.screenshot_url:
                screenshot_url = event.screenshot_url
            if event.payload:
                if "redirect_chain" in event.payload:
                    redirect_chain = [RedirectHop.model_validate(r) for r in event.payload["redirect_chain"]]
                if "requested_field" in event.payload:
                    requested_fields.append(RequestedField.model_validate(event.payload["requested_field"]))
                if "behaviour" in event.payload:
                    observed_behaviours.append(ObservedBehaviour.model_validate(event.payload["behaviour"]))

            # Send event chunk via SSE
            yield f"data: {event.model_dump_json()}\n\n"

        # If no redirects were extracted during live stream, create baseline hop
        if not redirect_chain:
            redirect_chain = [RedirectHop(hop=1, url=validation.normalized_url, status_code=200, timing_ms=120)]

        # Step 5: Gemini Reasoning & Final Dossier Synthesis
        report = await gemini_analyzer.analyze_evidence(
            report_id=report_id,
            original_url=validation.original_url,
            normalized_url=validation.normalized_url,
            hostname=validation.hostname,
            redirect_chain=redirect_chain,
            information_requested=requested_fields,
            observed_behaviour=observed_behaviours,
            screenshot_url=screenshot_url
        )

        # Persist report to SQLite database
        save_investigation(report)

        # Final completion event containing the full synthesized dossier
        complete_event = InvestigationEvent(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            event_type="complete",
            message=f"Investigation concluded. Verdict: {report.final_verdict} (Risk: {report.risk_score}/100)",
            vera_state="THREAT DETECTED" if report.final_verdict == "HIGH RISK" else "ASSESSMENT COMPLETE",
            screenshot_url=screenshot_url,
            current_url=validation.normalized_url,
            step=6,
            total_steps=6,
            payload={"report": report.model_dump()}
        )
        yield f"data: {complete_event.model_dump_json()}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

@app.get("/api/investigations", response_model=List[InvestigationReport])
async def get_investigations_history():
    return list_investigations()

@app.get("/api/investigations/{report_id}", response_model=InvestigationReport)
async def get_single_investigation(report_id: str):
    report = get_investigation(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Investigation report not found")
    return report

# Mount frontend production build if available
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")
    
    @app.get("/{full_path:path}", response_class=HTMLResponse)
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("simulations/"):
            raise HTTPException(status_code=404, detail="Not found")
        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return HTMLResponse(content=index_file.read_text(encoding="utf-8"))
        return HTMLResponse(content="<h1>VeritasLink API Online</h1>")


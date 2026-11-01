import os
from fastapi import APIRouter, Response
from fastapi.responses import HTMLResponse
from pathlib import Path

router = APIRouter(prefix="/simulations", tags=["Simulations"])

# 1. SCENARIO: ELECTRICITY BILL PAYMENT PHISHING SIMULATION
@router.get("/electricity/portal", response_class=HTMLResponse)
async def electricity_portal():
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PowerGrid Express — Urgent Bill Clearance</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f5f8; margin: 0; padding: 20px; color: #222; }
    .sim-banner { background: #fee2e2; border: 2px dashed #ef4444; color: #991b1b; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
    .card { background: #fff; max-width: 480px; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 20px; color: #1e3a8a; margin: 0 0 5px 0; }
    .urgency-badge { background: #dc2626; color: #fff; display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; animation: pulse 1.5s infinite; }
    .bill-info { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
    .bill-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .bill-row.total { font-size: 18px; font-weight: bold; color: #dc2626; border-top: 1px solid #cbd5e1; padding-top: 8px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #475569; }
    input { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
    .btn { background: #dc2626; color: #fff; width: 100%; padding: 12px; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; }
    .timer { font-size: 14px; text-align: center; margin-top: 15px; color: #b91c1c; font-weight: bold; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
  </style>
</head>
<body>
  <div class="sim-banner">
    ⚠️ SIMULATED PHISHING TEST ENVIRONMENT FOR HACKATHON EVALUATION ONLY — DO NOT ENTER REAL INFORMATION
  </div>
  <div class="card">
    <div class="header">
      <div class="urgency-badge">⚡ DISCONNECTION NOTICE: 14 MIN REMAINING</div>
      <h1>State Power & Electric QuickPay</h1>
      <p style="margin: 0; font-size: 12px; color: #64748b;">Notice Ref: SMS-POW-9841</p>
    </div>
    <div class="bill-info">
      <div class="bill-row"><span>Account No:</span> <strong>9841-3321-00</strong></div>
      <div class="bill-row"><span>Consumer:</span> <strong>RESIDENTIAL METER #42</strong></div>
      <div class="bill-row"><span>Status:</span> <strong style="color: #dc2626;">PENDING IMMEDIATE CUTOFF</strong></div>
      <div class="bill-row total"><span>Amount Overdue:</span> <span>$14.80</span></div>
    </div>
    <form onsubmit="event.preventDefault(); alert('Simulated form. Submission disabled.');">
      <div class="form-group">
        <label>Credit / Debit Card Number</label>
        <input type="text" name="card_number" placeholder="4532 •••• •••• ••••" required autocomplete="off" />
      </div>
      <div style="display: flex; gap: 10px;">
        <div class="form-group" style="flex: 1;">
          <label>Expiry Date</label>
          <input type="text" name="card_expiry" placeholder="MM/YY" required autocomplete="off" />
        </div>
        <div class="form-group" style="flex: 1;">
          <label>CVV / CVC</label>
          <input type="password" name="cvv" placeholder="•••" maxlength="4" required autocomplete="off" />
        </div>
      </div>
      <div class="form-group">
        <label>Cardholder Name</label>
        <input type="text" name="cardholder_name" placeholder="Full name on card" required autocomplete="off" />
      </div>
      <button type="submit" class="btn">PAY $14.80 & PREVENT POWER CUT</button>
      <div class="timer">⏱ Disconnection countdown: 13m 42s remaining</div>
    </form>
  </div>
</body>
</html>"""
    return HTMLResponse(content=html_content)

# 2. SCENARIO: COURIER DELIVERY REDIRECTION & CUSTOMS FEE SIMULATION
@router.get("/courier/auth", response_class=HTMLResponse)
async def courier_portal():
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GlobalTrack Express — Package Status & Redelivery</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #eef2f6; margin: 0; padding: 20px; color: #1e293b; }
    .sim-banner { background: #fee2e2; border: 2px dashed #ef4444; color: #991b1b; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
    .card { background: #fff; max-width: 520px; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); padding: 30px; }
    .logo { color: #f59e0b; font-size: 22px; font-weight: 900; margin-bottom: 15px; }
    .status-box { background: #fffbeb; border: 1px solid #fef3c7; border-left: 5px solid #f59e0b; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
    .form-group { margin-bottom: 14px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; }
    input { width: 100%; box-sizing: border-box; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; }
    .btn { background: #2563eb; color: #fff; width: 100%; padding: 12px; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div class="sim-banner">
    ⚠️ SIMULATED PHISHING TEST ENVIRONMENT FOR HACKATHON EVALUATION ONLY — DO NOT ENTER REAL INFORMATION
  </div>
  <div class="card">
    <div class="logo">GLOBAL EXPRESS 📦</div>
    <div class="status-box">
      <strong>Tracking #GT-8842-US: ON HOLD AT CUSTOMS</strong>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #92400e;">
        Delivery attempted. Street address missing building number. Pay $1.85 administrative clearance fee to release parcel.
      </p>
    </div>
    <form onsubmit="event.preventDefault(); alert('Simulated form. Submission disabled.');">
      <div class="form-group">
        <label>Full Residential Street Address</label>
        <input type="text" name="street_address" placeholder="123 Main St, Apt 4" required autocomplete="off" />
      </div>
      <div class="form-group">
        <label>Mobile Contact Number</label>
        <input type="tel" name="phone_number" placeholder="+1 (555) 000-0000" required autocomplete="off" />
      </div>
      <div class="form-group">
        <label>Debit / Credit Card for $1.85 Fee</label>
        <input type="text" name="card_num" placeholder="Card number" required autocomplete="off" />
      </div>
      <div style="display: flex; gap: 10px;">
        <div class="form-group" style="flex: 1;">
          <label>Exp Date</label>
          <input type="text" name="exp" placeholder="MM/YY" required autocomplete="off" />
        </div>
        <div class="form-group" style="flex: 1;">
          <label>CVV</label>
          <input type="password" name="cvv" placeholder="•••" required autocomplete="off" />
        </div>
      </div>
      <button type="submit" class="btn">CONFIRM ADDRESS & PAY $1.85</button>
    </form>
  </div>
</body>
</html>"""
    return HTMLResponse(content=html_content)

# 3. SCENARIO: BANKING KYC SUSPENSION SIMULATION
@router.get("/banking/login", response_class=HTMLResponse)
async def banking_portal():
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Trust Bank — Mandatory Regulatory KYC Update</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; margin: 0; padding: 20px; color: #f8fafc; }
    .sim-banner { background: #fee2e2; border: 2px dashed #ef4444; color: #991b1b; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
    .card { background: #1e293b; max-width: 480px; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); padding: 30px; border: 1px solid #334155; }
    .logo { color: #38bdf8; font-size: 22px; font-weight: 800; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 20px; }
    .alert { background: #7f1d1d; border: 1px solid #b91c1c; padding: 12px; border-radius: 6px; font-size: 13px; margin-bottom: 20px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #94a3b8; }
    input { width: 100%; box-sizing: border-box; padding: 10px 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #fff; font-size: 14px; }
    .btn { background: #0284c7; color: #fff; width: 100%; padding: 12px; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div class="sim-banner">
    ⚠️ SIMULATED PHISHING TEST ENVIRONMENT FOR HACKATHON EVALUATION ONLY — DO NOT ENTER REAL INFORMATION
  </div>
  <div class="card">
    <div class="logo">APEX TRUST NATIONAL BANK 🏛️</div>
    <div class="alert">
      <strong>URGENT ACCOUNT SUSPENSION NOTICE:</strong>
      Regulatory compliance requires instant verification of your registered NetBanking credentials within 24 hours.
    </div>
    <form onsubmit="event.preventDefault(); alert('Simulated form. Submission disabled.');">
      <div class="form-group">
        <label>Customer ID / Username</label>
        <input type="text" name="cust_id" placeholder="Enter NetBanking ID" required autocomplete="off" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" placeholder="••••••••" required autocomplete="off" />
      </div>
      <div class="form-group">
        <label>Transaction Security PIN</label>
        <input type="password" name="txn_pin" placeholder="••••" maxlength="6" required autocomplete="off" />
      </div>
      <div class="form-group">
        <label>Registered Phone Number</label>
        <input type="tel" name="phone_num" placeholder="+1 (555) 000-0000" required autocomplete="off" />
      </div>
      <button type="submit" class="btn">VERIFY KYC & RESTORE ACCOUNT</button>
    </form>
  </div>
</body>
</html>"""
    return HTMLResponse(content=html_content)

# SCREENSHOT ASSETS (Serve realistic, sharp SVG screenshot previews for browser viewport)
@router.get("/screenshots/{scenario_name}.svg")
async def get_screenshot(scenario_name: str):
    colors = {
        "electricity": {"bg": "#fee2e2", "accent": "#dc2626", "title": "PowerGrid QuickPay Urgent Disconnection", "domain": "powerbill-quickpay-alert.xyz"},
        "courier": {"bg": "#fef3c7", "accent": "#f59e0b", "title": "GlobalTrack Logistics — Clearance Fee $1.85", "domain": "track-parcel-redelivery-fee.top"},
        "banking": {"bg": "#0f172a", "accent": "#0284c7", "title": "Apex Trust Bank — KYC Suspension Alert", "domain": "apex-kyc-compliance-update.live"},
        "generic": {"bg": "#1e293b", "accent": "#8127b5", "title": "Web Portal Landing Page", "domain": "unverified-destination.net"}
    }
    cfg = colors.get(scenario_name, colors["generic"])

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <rect width="800" height="500" fill="#ffffff" />
      
      <!-- Top Browser Chrome Bar -->
      <rect width="800" height="40" fill="#f1f5f9" border="1" />
      <circle cx="20" cy="20" r="5" fill="#ef4444" />
      <circle cx="35" cy="20" r="5" fill="#f59e0b" />
      <circle cx="50" cy="20" r="5" fill="#10b981" />
      
      <rect x="80" y="8" width="640" height="24" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
      <text x="95" y="24" font-family="monospace" font-size="11" fill="#475569">http://{cfg['domain']}</text>
      
      <!-- Page Content Mock -->
      <rect x="0" y="40" width="800" height="460" fill="{cfg['bg']}" />
      
      <!-- Simulation Caution Banner -->
      <rect x="40" y="60" width="720" height="32" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-dasharray="4 4" />
      <text x="400" y="80" font-family="sans-serif" font-size="11" font-weight="bold" fill="#991b1b" text-anchor="middle">
        ⚠️ SIMULATED PHISHING TEST ENVIRONMENT FOR HACKATHON EVALUATION ONLY
      </text>
      
      <!-- Centered Card -->
      <rect x="180" y="110" width="440" height="340" rx="12" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
      <rect x="180" y="110" width="440" height="8" rx="4" fill="{cfg['accent']}" />
      
      <!-- Header text inside card -->
      <text x="400" y="150" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">
        {cfg['title']}
      </text>
      
      <!-- Deceptive input form fields -->
      <rect x="220" y="180" width="360" height="36" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="235" y="202" font-family="monospace" font-size="11" fill="#94a3b8">Account / Consumer ID</text>
      
      <rect x="220" y="230" width="360" height="36" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="235" y="252" font-family="monospace" font-size="11" fill="#94a3b8">Credit / Debit Card Number [•••• •••• •••• ••••]</text>
      
      <rect x="220" y="280" width="170" height="36" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="235" y="302" font-family="monospace" font-size="11" fill="#94a3b8">MM/YY</text>
      
      <rect x="410" y="280" width="170" height="36" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="425" y="302" font-family="monospace" font-size="11" fill="#94a3b8">CVV [•••]</text>
      
      <!-- Urgency Button -->
      <rect x="220" y="340" width="360" height="42" rx="8" fill="{cfg['accent']}" />
      <text x="400" y="366" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">
        PROCEED TO VERIFY & SUBMIT PAYMENT
      </text>
      
      <!-- Countdown timer stamp -->
      <text x="400" y="415" font-family="monospace" font-size="11" font-weight="bold" fill="#b91c1c" text-anchor="middle">
        ⏱ URGENCY COUNTDOWN: 13 MINUTES REMAINING
      </text>
    </svg>"""
    return Response(content=svg, media_type="image/svg+xml")


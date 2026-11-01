from typing import Optional, Dict, Any
from ..models import BrandDetails

KNOWN_BRANDS: Dict[str, BrandDetails] = {
    "electricity": BrandDetails(
        brand_name="State Power & Electric Board",
        domain="statepower.gov",
        ssl_issuer="DigiCert Global Root CA (Extended Validation EV)",
        branding_claim="State Power & Electric Board — Official Municipal Billing Service",
        contact_info="Official Emergency Hotline: 1-800-555-POWR (24/7 Verified)",
        payment_methods="Authorized Municipal Portal / Central BBPS / Treasury Gateway",
        logo_url="https://statepower.gov/assets/logo.png"
    ),
    "courier": BrandDetails(
        brand_name="Global Express Parcel Service",
        domain="globalexpress.com",
        ssl_issuer="Cloudflare Inc ECC CA-3 (Corporate Verified EV)",
        branding_claim="Global Express Logistics & Worldwide Freight Corporation",
        contact_info="Customer Care: 1-800-444-PARCEL | support@globalexpress.com",
        payment_methods="Pre-authorized Account Invoicing / Verified PCI-DSS Tier 1 Gateway",
        logo_url="https://globalexpress.com/branding/mark.png"
    ),
    "banking": BrandDetails(
        brand_name="Apex Trust National Bank",
        domain="apextrustbank.com",
        ssl_issuer="Entrust EV Multi-Domain TLS CA (FIPS 140-2 Level 3)",
        branding_claim="Apex Trust National Banking & Securities Corporation",
        contact_info="Fraud Response Desk: 1-888-APEX-SEC | verified-hotline",
        payment_methods="Encrypted Tokenized 2FA Banking Interface / Fedwire / SWIFT",
        logo_url="https://apextrustbank.com/logo.svg"
    ),
    "paypal": BrandDetails(
        brand_name="PayPal",
        domain="paypal.com",
        ssl_issuer="DigiCert SHA2 Extended Validation Server CA",
        branding_claim="PayPal, Inc. Financial Technology",
        contact_info="1-888-221-1161 | Official Help Center paypal.com/help",
        payment_methods="OAuth2 Tokenized Wallet Checkout",
        logo_url="https://paypal.com/logo.png"
    ),
    "microsoft": BrandDetails(
        brand_name="Microsoft",
        domain="microsoft.com",
        ssl_issuer="Microsoft RSA TLS CA 01",
        branding_claim="Microsoft Corporation",
        contact_info="support.microsoft.com",
        payment_methods="Microsoft Account Commerce Service",
        logo_url="https://microsoft.com/logo.png"
    ),
    "netflix": BrandDetails(
        brand_name="Netflix",
        domain="netflix.com",
        ssl_issuer="Amazon RSA 2048 M02",
        branding_claim="Netflix Inc. Entertainment",
        contact_info="help.netflix.com",
        payment_methods="Stripe / Adyen tokenized recurring billing",
        logo_url="https://netflix.com/logo.png"
    )
}

def identify_brand_impersonation(target_text: str, domain: str) -> Optional[BrandDetails]:
    """
    Scans target text and domain to find matching known brand.
    """
    text_lower = target_text.lower()
    domain_lower = domain.lower()

    if any(k in text_lower or k in domain_lower for k in ["power", "electric", "bill", "disconnection", "electricity"]):
        return KNOWN_BRANDS["electricity"]
    if any(k in text_lower or k in domain_lower for k in ["courier", "parcel", "delivery", "customs", "shipment"]):
        return KNOWN_BRANDS["courier"]
    if any(k in text_lower or k in domain_lower for k in ["bank", "kyc", "apex", "account", "netbanking", "trust"]):
        return KNOWN_BRANDS["banking"]
    if "paypal" in text_lower or "paypal" in domain_lower:
        return KNOWN_BRANDS["paypal"]
    if "microsoft" in text_lower or "office365" in domain_lower or "msft" in domain_lower:
        return KNOWN_BRANDS["microsoft"]
    if "netflix" in text_lower or "netflix" in domain_lower:
        return KNOWN_BRANDS["netflix"]

    return None


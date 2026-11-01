import re
from urllib.parse import urlparse, parse_qs, urlunparse
from typing import Dict, List, Tuple
from ..models import UrlValidationResult
from ..config import ALLOWED_URL_SCHEMES, FORBIDDEN_HOSTS

SENSITIVE_PARAM_KEYWORDS = [
    "token", "auth", "session", "otp", "key", "secret", "password", 
    "pin", "jwt", "access_token", "credential", "auth_token"
]

def analyze_and_validate_url(raw_url: str) -> UrlValidationResult:
    stripped = raw_url.strip()
    if not stripped.startswith("http://") and not stripped.startswith("https://"):
        # prepend https:// by default for validation
        stripped = "https://" + stripped

    try:
        parsed = urlparse(stripped)
    except Exception as e:
        return UrlValidationResult(
            original_url=raw_url,
            normalized_url="",
            scheme="",
            hostname="",
            domain="",
            path="",
            is_valid=False,
            warning=f"Invalid URL structure: {str(e)}",
            has_tracking_tokens=False,
            tracking_tokens_found=[],
        )

    scheme = parsed.scheme.lower()
    if scheme not in ALLOWED_URL_SCHEMES:
        return UrlValidationResult(
            original_url=raw_url,
            normalized_url="",
            scheme=scheme,
            hostname=parsed.hostname or "",
            domain="",
            path="",
            is_valid=False,
            warning=f"Disallowed scheme: '{scheme}'. VeritasLink only inspects HTTP/HTTPS endpoints.",
            has_tracking_tokens=False,
            tracking_tokens_found=[],
        )

    hostname = (parsed.hostname or "").lower()
    if not hostname:
        return UrlValidationResult(
            original_url=raw_url,
            normalized_url="",
            scheme=scheme,
            hostname="",
            domain="",
            path="",
            is_valid=False,
            warning="Missing hostname in URL.",
            has_tracking_tokens=False,
            tracking_tokens_found=[],
        )

    # Security check: forbid localhost and cloud metadata
    if hostname in FORBIDDEN_HOSTS or hostname.startswith("127.") or hostname.startswith("192.168.") or hostname.startswith("10."):
        return UrlValidationResult(
            original_url=raw_url,
            normalized_url="",
            scheme=scheme,
            hostname=hostname,
            domain=hostname,
            path=parsed.path,
            is_valid=False,
            warning="Target resolves to local loopback or private network address. Access forbidden for security isolation.",
            has_tracking_tokens=False,
            tracking_tokens_found=[],
        )

    # Extract query params & check for sensitive authentication tokens
    query_dict = {}
    tokens_found = []
    if parsed.query:
        raw_qs = parse_qs(parsed.query)
        for k, vals in raw_qs.items():
            k_lower = k.lower()
            query_dict[k] = vals[0] if vals else ""
            for sensitive_key in SENSITIVE_PARAM_KEYWORDS:
                if sensitive_key in k_lower:
                    tokens_found.append(k)
                    break

    # Reconstruct normalized URL (port normalization, lowercased host)
    netloc = hostname
    if parsed.port:
        if (scheme == "http" and parsed.port != 80) or (scheme == "https" and parsed.port != 443):
            netloc = f"{hostname}:{parsed.port}"

    normalized_url = urlunparse((
        scheme,
        netloc,
        parsed.path or "/",
        parsed.params,
        parsed.query,
        ""  # strip fragments
    ))

    # Basic root domain extraction
    domain_parts = hostname.split(".")
    domain = ".".join(domain_parts[-2:]) if len(domain_parts) >= 2 else hostname

    has_tokens = len(tokens_found) > 0
    warning = None
    if has_tokens:
        warning = f"URL contains potential session/auth tokens ({', '.join(tokens_found)}). Automated agent will not transmit real user credentials."

    return UrlValidationResult(
        original_url=raw_url,
        normalized_url=normalized_url,
        scheme=scheme,
        hostname=hostname,
        domain=domain,
        path=parsed.path or "/",
        query_params=query_dict,
        is_valid=True,
        warning=warning,
        has_tracking_tokens=has_tokens,
        tracking_tokens_found=tokens_found,
    )


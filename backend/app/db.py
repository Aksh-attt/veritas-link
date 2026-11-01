import sqlite3
import json
from typing import List, Optional, Dict, Any
from pathlib import Path
from .config import DB_PATH
from .models import InvestigationReport

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        normalized_url TEXT NOT NULL,
        hostname TEXT NOT NULL,
        created_at TEXT NOT NULL,
        duration_seconds REAL NOT NULL,
        final_verdict TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        confidence TEXT NOT NULL,
        impersonated_brand TEXT,
        impersonated_category TEXT,
        official_domain TEXT,
        report_json TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def save_investigation(report: InvestigationReport):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO investigations (
        id, url, normalized_url, hostname, created_at, duration_seconds,
        final_verdict, risk_score, confidence, impersonated_brand,
        impersonated_category, official_domain, report_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        report.id,
        report.url,
        report.normalized_url,
        report.hostname,
        report.created_at,
        report.duration_seconds,
        report.final_verdict,
        report.risk_score,
        report.confidence,
        report.impersonated_brand,
        report.impersonated_category,
        report.official_domain,
        report.model_dump_json()
    ))
    conn.commit()
    conn.close()

def get_investigation(report_id: str) -> Optional[InvestigationReport]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT report_json FROM investigations WHERE id = ?", (report_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        data = json.loads(row["report_json"])
        return InvestigationReport.model_validate(data)
    return None

def list_investigations(limit: int = 50) -> List[InvestigationReport]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT report_json FROM investigations ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    results = []
    for r in rows:
        try:
            results.append(InvestigationReport.model_validate_json(r["report_json"]))
        except Exception:
            pass
    return results


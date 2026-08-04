"""Invoice Matching Intelligence API"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_invoices():
    # TODO: List invoices with filtering and pagination
    return {"invoices": [], "total": 0}

@router.post("/upload")
async def upload_invoice():
    # TODO: Upload and parse invoice (PDF/Excel)
    return {"status": "pending"}

@router.post("/{invoice_id}/match")
async def match_invoice(invoice_id: str):
    # TODO: Trigger AI three-way matching
    return {"status": "processing"}

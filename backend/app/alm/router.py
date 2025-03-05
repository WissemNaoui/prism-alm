
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import date, datetime
from .models import (
    AssetLiability, 
    GapAnalysisRequest, 
    GapAnalysisResult,
    StressTestScenario, 
    StressTestResult,
    RiskAppetite,
    RiskType,
    DataSource
)
from .service import ALMService
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api/alm", tags=["ALM"])
alm_service = ALMService()

@router.get("/datasources", response_model=List[DataSource])
async def get_datasources(current_user: dict = Depends(get_current_user)):
    """Get all configured data sources for ALM system"""
    return alm_service.get_datasources()

@router.post("/extract-data")
async def extract_data(
    source_id: str, 
    as_of_date: date = Query(None), 
    current_user: dict = Depends(get_current_user)
):
    """Trigger data extraction from a specific source"""
    try:
        result = alm_service.extract_data(source_id, as_of_date or date.today())
        return {"status": "success", "extracted_items": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data extraction failed: {str(e)}")

@router.get("/assets", response_model=List[AssetLiability])
async def get_assets(
    as_of_date: date = Query(None),
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all assets as of a specific date"""
    return alm_service.get_assets(as_of_date or date.today(), category)

@router.get("/liabilities", response_model=List[AssetLiability])
async def get_liabilities(
    as_of_date: date = Query(None),
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all liabilities as of a specific date"""
    return alm_service.get_liabilities(as_of_date or date.today(), category)

@router.post("/gap-analysis", response_model=GapAnalysisResult)
async def perform_gap_analysis(
    request: GapAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """Perform gap analysis (static or dynamic)"""
    return alm_service.perform_gap_analysis(request)

@router.get("/stress-test/scenarios", response_model=List[StressTestScenario])
async def get_stress_test_scenarios(
    risk_type: Optional[RiskType] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all stress test scenarios, optionally filtered by risk type"""
    return alm_service.get_stress_test_scenarios(risk_type)

@router.post("/stress-test/run", response_model=StressTestResult)
async def run_stress_test(
    scenario_id: str,
    as_of_date: date = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Run a stress test based on a specific scenario"""
    return alm_service.run_stress_test(scenario_id, as_of_date or date.today())

@router.get("/risk-appetite", response_model=List[RiskAppetite])
async def get_risk_appetite(
    risk_type: Optional[RiskType] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get current risk appetite thresholds and values"""
    return alm_service.get_risk_appetite(risk_type)

@router.get("/reports/regulatory")
async def generate_regulatory_report(
    report_type: str,
    as_of_date: date = Query(None),
    format: str = "pdf",
    current_user: dict = Depends(get_current_user)
):
    """Generate a regulatory report"""
    report_url = alm_service.generate_regulatory_report(
        report_type, as_of_date or date.today(), format
    )
    return {"report_url": report_url}

@router.get("/reports/alco")
async def generate_alco_report(
    as_of_date: date = Query(None),
    format: str = "pdf",
    current_user: dict = Depends(get_current_user)
):
    """Generate an ALCO (Asset Liability Committee) report"""
    report_url = alm_service.generate_alco_report(as_of_date or date.today(), format)
    return {"report_url": report_url}

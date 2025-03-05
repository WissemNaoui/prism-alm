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

# Define API router for ALM endpoints
router = APIRouter(prefix="/api/alm", tags=["ALM"])
# Initialize ALM service
alm_service = ALMService()

@router.get("/datasources", response_model=List[DataSource])
async def get_datasources(current_user: dict = Depends(get_current_user)):
    """
    Get all configured data sources for the ALM system.

    Args:
        current_user (dict, optional):  The currently authenticated user.  Provided by the get_current_user dependency.

    Returns:
        List[DataSource]: A list of DataSource objects representing the configured data sources.
    """
    return alm_service.get_datasources()

@router.post("/extract-data")
async def extract_data(
    source_id: str, 
    as_of_date: date = Query(None), 
    current_user: dict = Depends(get_current_user)
):
    """
    Trigger data extraction from a specified data source.

    Args:
        source_id (str): The ID of the data source to extract data from.
        as_of_date (date, optional): The date to extract data as of. Defaults to the current date.
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        dict: A dictionary containing the status ("success") and the extracted data.  Raises an HTTPException if extraction fails.

    Raises:
        HTTPException: If data extraction encounters an error (status code 500).
    """
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
    """
    Get all assets as of a specific date, optionally filtered by category.

    Args:
        as_of_date (date, optional): The date to retrieve assets as of. Defaults to the current date.
        category (Optional[str], optional): An optional category filter for assets.
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        List[AssetLiability]: A list of AssetLiability objects representing the assets.
    """
    return alm_service.get_assets(as_of_date or date.today(), category)

@router.get("/liabilities", response_model=List[AssetLiability])
async def get_liabilities(
    as_of_date: date = Query(None),
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all liabilities as of a specific date, optionally filtered by category.

    Args:
        as_of_date (date, optional): The date to retrieve liabilities as of. Defaults to the current date.
        category (Optional[str], optional): An optional category filter for liabilities.
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        List[AssetLiability]: A list of AssetLiability objects representing the liabilities.
    """
    return alm_service.get_liabilities(as_of_date or date.today(), category)

@router.post("/gap-analysis", response_model=GapAnalysisResult)
async def perform_gap_analysis(
    request: GapAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Perform gap analysis (static or dynamic).

    Args:
        request (GapAnalysisRequest): The request object containing parameters for the gap analysis.
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        GapAnalysisResult: The result of the gap analysis.
    """
    return alm_service.perform_gap_analysis(request)

@router.get("/stress-test/scenarios", response_model=List[StressTestScenario])
async def get_stress_test_scenarios(
    risk_type: Optional[RiskType] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all stress test scenarios, optionally filtered by risk type.

    Args:
        risk_type (Optional[RiskType], optional): An optional filter for stress test scenarios by risk type.
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        List[StressTestScenario]: A list of StressTestScenario objects.
    """
    return alm_service.get_stress_test_scenarios(risk_type)

@router.post("/stress-test/run", response_model=StressTestResult)
async def run_stress_test(
    scenario_id: str,
    as_of_date: date = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Run a stress test based on a specific scenario ID.

    Args:
        scenario_id (str): The ID of the stress test scenario to run.
        as_of_date (date, optional): The date to run the stress test as of. Defaults to the current date.
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        StressTestResult: The result of the stress test.
    """
    return alm_service.run_stress_test(scenario_id, as_of_date or date.today())

@router.get("/risk-appetite", response_model=List[RiskAppetite])
async def get_risk_appetite(
    risk_type: Optional[RiskType] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Get current risk appetite thresholds and values, optionally filtered by risk type.

    Args:
        risk_type (Optional[RiskType], optional): An optional filter for risk appetite by risk type.
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        List[RiskAppetite]: A list of RiskAppetite objects.
    """
    return alm_service.get_risk_appetite(risk_type)

@router.get("/reports/regulatory")
async def generate_regulatory_report(
    report_type: str,
    as_of_date: date = Query(None),
    format: str = "pdf",
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a regulatory report.

    Args:
        report_type (str): The type of regulatory report to generate.
        as_of_date (date, optional): The date to generate the report as of. Defaults to the current date.
        format (str, optional): The format of the report (e.g., "pdf"). Defaults to "pdf".
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        dict: A dictionary containing the URL of the generated report.
    """
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
    """
    Generate an ALCO (Asset Liability Committee) report.

    Args:
        as_of_date (date, optional): The date to generate the report as of. Defaults to the current date.
        format (str, optional): The format of the report (e.g., "pdf"). Defaults to "pdf".
        current_user (dict, optional): The currently authenticated user. Provided by the get_current_user dependency.

    Returns:
        dict: A dictionary containing the URL of the generated report.
    """
    report_url = alm_service.generate_alco_report(as_of_date or date.today(), format)
    return {"report_url": report_url}
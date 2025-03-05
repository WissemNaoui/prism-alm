
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum

class RiskType(str, Enum):
    MARKET = "market"
    LIQUIDITY = "liquidity"
    CONCENTRATION = "concentration"
    INTEREST_RATE = "interest_rate"

class Currency(str, Enum):
    TND = "TND"
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    AED = "AED"

class DataSource(BaseModel):
    name: str
    source_type: str
    connection_params: Dict[str, Any]
    last_extraction: Optional[datetime] = None

class AssetLiability(BaseModel):
    id: str
    type: str
    category: str
    amount: float
    currency: Currency
    maturity_date: Optional[date] = None
    interest_rate: Optional[float] = None
    fixed_rate: bool = True
    counterparty: Optional[str] = None

class GapAnalysisRequest(BaseModel):
    as_of_date: date
    time_buckets: List[int]  # in days
    is_dynamic: bool = False
    scenario_id: Optional[str] = None

class GapAnalysisResult(BaseModel):
    as_of_date: date
    time_buckets: List[int]
    assets_by_bucket: List[float]
    liabilities_by_bucket: List[float]
    gap_by_bucket: List[float]
    cumulative_gap: List[float]
    is_dynamic: bool
    scenario_details: Optional[Dict[str, Any]] = None

class StressTestScenario(BaseModel):
    id: str
    name: str
    description: str
    risk_type: RiskType
    parameters: Dict[str, Any]
    created_at: datetime = datetime.now()
    created_by: str

class StressTestResult(BaseModel):
    scenario_id: str
    run_date: datetime = datetime.now()
    impact_metrics: Dict[str, float]
    affected_assets: List[str]
    affected_liabilities: List[str]
    report_summary: str

class RiskAppetite(BaseModel):
    risk_type: RiskType
    metric_name: str
    threshold_warning: float
    threshold_critical: float
    current_value: Optional[float] = None
    updated_at: datetime = datetime.now()

from typing import List, Optional, Dict, Any
from datetime import date, datetime
import logging
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

# Configure logging
logger = logging.getLogger(__name__)

class ALMService:
    """Service for handling Asset Liability Management (ALM) operations.  This class uses mock data for demonstration; a production system would connect to a database."""

    def __init__(self):
        # Initialize mock data. In a real application, this would involve database connection.
        self.mock_data = self._initialize_mock_data()

    def _initialize_mock_data(self) -> Dict[str, Any]:
        """Initialize mock data for demonstration purposes.  This creates sample assets, liabilities, scenarios, and risk appetite data."""
        today = date.today()
        return {
            "datasources": [
                DataSource(
                    name="Core Banking System",
                    source_type="database",
                    connection_params={"host": "core-db", "type": "oracle"},
                    last_extraction=datetime.now()
                ),
                DataSource(
                    name="Treasury Management System",
                    source_type="api",
                    connection_params={"url": "https://treasury-api", "auth": "oauth2"},
                    last_extraction=datetime.now()
                )
            ],
            "assets": [
                AssetLiability(
                    id="A001",
                    type="asset",
                    category="loans",
                    amount=1000000.0,
                    currency="TND",
                    maturity_date=date(today.year + 1, today.month, today.day),
                    interest_rate=5.5,
                    fixed_rate=True,
                    counterparty="Corporate Client 1"
                ),
                AssetLiability(
                    id="A002",
                    type="asset",
                    category="bonds",
                    amount=500000.0,
                    currency="USD",
                    maturity_date=date(today.year + 2, today.month, today.day),
                    interest_rate=3.2,
                    fixed_rate=True,
                    counterparty="Government"
                )
            ],
            "liabilities": [
                AssetLiability(
                    id="L001",
                    type="liability",
                    category="deposits",
                    amount=800000.0,
                    currency="TND",
                    maturity_date=date(today.year, today.month + 3, 1),
                    interest_rate=2.5,
                    fixed_rate=True,
                    counterparty="Retail Customers"
                ),
                AssetLiability(
                    id="L002",
                    type="liability",
                    category="borrowings",
                    amount=600000.0,
                    currency="EUR",
                    maturity_date=date(today.year + 1, today.month, today.day),
                    interest_rate=3.0,
                    fixed_rate=False,
                    counterparty="Central Bank"
                )
            ],
            "scenarios": [
                StressTestScenario(
                    id="S001",
                    name="Interest Rate Shock +200bp",
                    description="Parallel shift of interest rate curve by +200 basis points",
                    risk_type=RiskType.INTEREST_RATE,
                    parameters={"shock": 2.0},
                    created_by="admin"
                ),
                StressTestScenario(
                    id="S002",
                    name="Liquidity Stress - Market Crisis",
                    description="Severe market conditions causing liquidity shortage",
                    risk_type=RiskType.LIQUIDITY,
                    parameters={"haircut": 0.3, "deposit_runoff": 0.2},
                    created_by="admin"
                )
            ],
            "risk_appetite": [
                RiskAppetite(
                    risk_type=RiskType.LIQUIDITY,
                    metric_name="LCR",
                    threshold_warning=1.1,
                    threshold_critical=1.0,
                    current_value=1.25
                ),
                RiskAppetite(
                    risk_type=RiskType.INTEREST_RATE,
                    metric_name="NII Sensitivity to 100bp",
                    threshold_warning=10,
                    threshold_critical=15,
                    current_value=7.5
                )
            ]
        }

    def get_datasources(self) -> List[DataSource]:
        """Retrieve all configured data sources."""
        return self.mock_data["datasources"]

    def extract_data(self, source_id: str, as_of_date: date) -> int:
        """Extract data from a specified source.  This is a placeholder; a real implementation would connect to the data source."""
        logger.info(f"Extracting data from source {source_id} as of {as_of_date}")
        # Simulate data extraction
        return 150

    def get_assets(self, as_of_date: date, category: Optional[str] = None) -> List[AssetLiability]:
        """Retrieve all assets as of a given date, optionally filtered by category."""
        assets = self.mock_data["assets"]
        if category:
            assets = [a for a in assets if a.category == category]
        return assets

    def get_liabilities(self, as_of_date: date, category: Optional[str] = None) -> List[AssetLiability]:
        """Retrieve all liabilities as of a given date, optionally filtered by category."""
        liabilities = self.mock_data["liabilities"]
        if category:
            liabilities = [l for l in liabilities if l.category == category]
        return liabilities

    def perform_gap_analysis(self, request: GapAnalysisRequest) -> GapAnalysisResult:
        """Perform gap analysis (static or dynamic).  This is a simplified mock implementation."""
        assets = self.get_assets(request.as_of_date)
        liabilities = self.get_liabilities(request.as_of_date)

        # Mock gap calculation
        assets_by_bucket = [1000000, 800000, 600000, 400000]
        liabilities_by_bucket = [800000, 700000, 500000, 300000]
        gap_by_bucket = [a - l for a, l in zip(assets_by_bucket, liabilities_by_bucket)]
        cumulative_gap = []
        running_sum = 0
        for gap in gap_by_bucket:
            running_sum += gap
            cumulative_gap.append(running_sum)

        return GapAnalysisResult(
            as_of_date=request.as_of_date,
            time_buckets=request.time_buckets,
            assets_by_bucket=assets_by_bucket,
            liabilities_by_bucket=liabilities_by_bucket,
            gap_by_bucket=gap_by_bucket,
            cumulative_gap=cumulative_gap,
            is_dynamic=request.is_dynamic,
            scenario_details={"name": "Base Scenario"} if request.scenario_id else None
        )

    def get_stress_test_scenarios(self, risk_type: Optional[RiskType] = None) -> List[StressTestScenario]:
        """Retrieve all stress test scenarios, optionally filtered by risk type."""
        scenarios = self.mock_data["scenarios"]
        if risk_type:
            scenarios = [s for s in scenarios if s.risk_type == risk_type]
        return scenarios

    def run_stress_test(self, scenario_id: str, as_of_date: date) -> StressTestResult:
        """Run a stress test based on a specific scenario. This is a placeholder; a production system would perform complex calculations."""
        scenarios = self.mock_data["scenarios"]
        scenario = next((s for s in scenarios if s.id == scenario_id), None)
        if not scenario:
            raise ValueError(f"Scenario with ID {scenario_id} not found")

        # Mock stress test results
        return StressTestResult(
            scenario_id=scenario_id,
            run_date=datetime.now(),
            impact_metrics={
                "capital_impact_pct": -2.5,
                "nii_impact_pct": -5.8,
                "liquidity_buffer_impact_pct": -10.2
            },
            affected_assets=["A001", "A002"],
            affected_liabilities=["L001", "L002"],
            report_summary=f"Stress test for scenario '{scenario.name}' shows moderate impact on capital and NII."
        )

    def get_risk_appetite(self, risk_type: Optional[RiskType] = None) -> List[RiskAppetite]:
        """Retrieve current risk appetite thresholds and values."""
        risk_appetites = self.mock_data["risk_appetite"]
        if risk_type:
            risk_appetites = [r for r in risk_appetites if r.risk_type == risk_type]
        return risk_appetites

    def generate_regulatory_report(self, report_type: str, as_of_date: date, format: str) -> str:
        """Generate a regulatory report. This is a placeholder;  a real implementation would generate a report file."""
        report_name = f"{report_type}_{as_of_date.strftime('%Y%m%d')}.{format}"
        return f"/reports/regulatory/{report_name}"

    def generate_alco_report(self, as_of_date: date, format: str) -> str:
        """Generate an ALCO (Asset Liability Committee) report. This is a placeholder; a real implementation would generate a report file."""
        report_name = f"alco_{as_of_date.strftime('%Y%m%d')}.{format}"
        return f"/reports/alco/{report_name}"
# app/alm/models.py
# This file defines data models for Asset-Liability Management (ALM) functionality

from datetime import datetime
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field

class RiskType(str, Enum):
    """
    Enumeration of different types of financial risks that the ALM system tracks.

    Using str as the base ensures these values are serialized properly in API responses.
    """
    LIQUIDITY = "liquidity"           # Risk related to the ability to meet short-term obligations
    INTEREST_RATE = "interest_rate"   # Risk from fluctuations in interest rates
    MARKET = "market"                 # Risk from changes in market conditions
    CONCENTRATION = "concentration"   # Risk from over-exposure to a single entity or sector

class RiskAssessment(BaseModel):
    """
    Model representing a risk assessment within the ALM system.

    Captures the result of analyzing a specific type of risk at a point in time.
    """
    risk_type: RiskType                             # Type of risk being assessed
    risk_score: float = Field(..., ge=0, le=100)    # Score from 0-100 indicating risk level
    analysis_date: datetime                         # When the assessment was performed
    description: str                                # Textual description of the risk assessment
    recommendations: List[str]                      # List of recommended actions to mitigate risk

class StressTestResult(BaseModel):
    """
    Model representing the results of a stress test.

    Stress tests simulate extreme market conditions to evaluate the impact on the bank.
    """
    id: int                                         # Unique identifier for the stress test
    scenario_name: str                              # Name of the stress scenario
    execution_date: datetime                        # When the test was executed
    risk_type: RiskType                             # Type of risk being stress-tested
    impact_level: float = Field(..., ge=0, le=100)  # Severity of impact (0-100)
    description: str                                # Description of the stress test scenario
    actions_recommended: List[str]                  # Actions recommended to mitigate identified risks

class GapAnalysisResult(BaseModel):
    """
    Model representing results of a gap analysis.

    Gap analysis compares assets and liabilities across different time periods
    to identify potential funding gaps or excess liquidity.
    """
    id: int                           # Unique identifier for the analysis
    analysis_date: datetime           # When the analysis was performed
    period: str                       # Time period (e.g., "1M", "3M", "6M", "1Y")
    assets: float                     # Value of assets maturing in the period
    liabilities: float                # Value of liabilities due in the period
    gap: float                        # Absolute difference between assets and liabilities
    relative_gap: float               # Gap as a percentage of total assets
    description: Optional[str]        # Optional explanation of the gap analysis

class Dashboard(BaseModel):
    """
    Model representing the composite data for the ALM dashboard.

    Aggregates current risk assessments, recent stress tests, and gap analysis
    for display in the user interface.
    """
    current_risk_assessment: List[RiskAssessment]   # Current risk situation assessments
    recent_stress_tests: List[StressTestResult]     # Results from recent stress tests
    gap_analysis: List[GapAnalysisResult]           # Recent gap analysis results

# ALM System Data Flow Architecture

The following diagram illustrates the data flow architecture of the Asset Liability Management (ALM) system:

```mermaid
graph TD
    subgraph "Data Sources"
        CoreBanking[Core Banking System]
        MarketData[Market Data Feeds]
        RiskParams[Risk Parameters]
        UserInputs[User Inputs/Manual Data]
    end

    subgraph "Backend Services"
        DataExtraction[Data Extraction Service]
        ALMCore[ALM Core Processing]
        RiskEngine[Risk Analysis Engine]
        StressTest[Stress Testing Module]
        ReportGen[Report Generation]
        AuthService[Authentication Service]
    end

    subgraph "Frontend Components"
        Auth[Authentication UI]
        Dashboard[Main Dashboard]
        LiquidityRisk[Liquidity Risk Module]
        MarketRisk[Market Risk Module]
        GapAnalysis[Gap Analysis UI]
        ReportUI[Reporting Interface]
        ConfigUI[Configuration UI]
    end

    subgraph "Outputs"
        RegReports[Regulatory Reports]
        ALCOReports[ALCO Reports]
        RiskDashboards[Risk Dashboards]
        Alerts[Risk Alerts]
    end

    %% Data flow connections
    CoreBanking -->|Asset/Liability Data| DataExtraction
    MarketData -->|Rates & Market Prices| DataExtraction
    RiskParams -->|Risk Parameters| ALMCore
    UserInputs -->|Manual Entries| DataExtraction

    DataExtraction -->|Structured Data| ALMCore
    AuthService <-->|User Auth| Auth

    ALMCore -->|Core Data| RiskEngine
    ALMCore -->|Cash Flows| GapAnalysis
    RiskEngine -->|Risk Metrics| StressTest
    RiskEngine -->|Risk Analysis| LiquidityRisk
    RiskEngine -->|Risk Analysis| MarketRisk
    
    StressTest -->|Stress Results| ReportGen
    RiskEngine -->|Risk Metrics| ReportGen
    
    ReportGen -->|Generated Reports| RegReports
    ReportGen -->|Generated Reports| ALCOReports
    ReportGen -->|Visualizations| RiskDashboards
    RiskEngine -->|Threshold Violations| Alerts

    Auth -->|Login| Dashboard
    Dashboard -->|Navigate| LiquidityRisk
    Dashboard -->|Navigate| MarketRisk
    Dashboard -->|Navigate| GapAnalysis
    Dashboard -->|Navigate| ReportUI
    Dashboard -->|Navigate| ConfigUI

    ReportUI -.->|View| RegReports
    ReportUI -.->|View| ALCOReports
    Dashboard -.->|Display| RiskDashboards
    Dashboard -.->|Notify| Alerts

    classDef sourceNode fill:#e1f5fe,stroke:#01579b
    classDef backendNode fill:#e8f5e9,stroke:#2e7d32
    classDef frontendNode fill:#fff3e0,stroke:#e65100
    classDef outputNode fill:#f3e5f5,stroke:#7b1fa2

    class CoreBanking,MarketData,RiskParams,UserInputs sourceNode
    class DataExtraction,ALMCore,RiskEngine,StressTest,ReportGen,AuthService backendNode
    class Auth,Dashboard,LiquidityRisk,MarketRisk,GapAnalysis,ReportUI,ConfigUI frontendNode
    class RegReports,ALCOReports,RiskDashboards,Alerts outputNode
```

## Key Components Explained

### Data Sources
- **Core Banking System**: Provides asset and liability data including loans, deposits, and investments
- **Market Data Feeds**: External market rates, yield curves, FX rates
- **Risk Parameters**: Configuration of risk thresholds, models, and appetite parameters
- **User Inputs**: Manual adjustments, assumptions, and scenario definitions

### Backend Services
- **Data Extraction Service**: Retrieves and transforms data from various sources
- **ALM Core Processing**: Central processing for asset-liability matching, gap analysis, etc.
- **Risk Analysis Engine**: Performs risk calculations (liquidity, interest rate, market risks)
- **Stress Testing Module**: Applies stress scenarios to assess resilience
- **Report Generation**: Creates regulatory and management reports
- **Authentication Service**: Manages user authentication and authorization

### Frontend Components
- **Authentication UI**: User login and account management
- **Main Dashboard**: Overview of key risk metrics and indicators
- **Liquidity Risk Module**: Detailed liquidity risk management interface
- **Market Risk Module**: Market and interest rate risk management
- **Gap Analysis UI**: Visualization of asset-liability gaps
- **Reporting Interface**: Report generation and viewing
- **Configuration UI**: System configuration and parameters

### Outputs
- **Regulatory Reports**: Basel III and BCT compliance reports
- **ALCO Reports**: Reports for Asset Liability Committee
- **Risk Dashboards**: Visual representations of risk positions
- **Risk Alerts**: Notifications for threshold breaches

## Data Flow Process

1. Data is collected from various sources (Core Banking, Market Data, etc.)
2. The backend processes this data through various analytical engines
3. Results are stored and made available to the frontend components
4. Users interact with the frontend to view reports, analyze risks, and configure the system
5. The system generates outputs in the form of reports, dashboards, and alerts

This architecture supports the key functional requirements including gap analysis, stress testing, risk management, and regulatory reporting.

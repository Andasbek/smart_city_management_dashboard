from fastapi import APIRouter
from app.schemas.dashboard import CitySummary
from app.services.mock_data_service import mock_data_service

router = APIRouter()

@router.get("/summary", response_model=CitySummary)
def get_dashboard_summary():
    data = mock_data_service.get_current_data()
    alerts = data.get("alerts", [])
    transport_data = data.get("transport", [])
    ecology_data = data.get("ecology", [])
    
    transport_issues = sum(1 for t in transport_data if t["status"] in ["Yellow", "Red"])
    ecology_issues = sum(1 for e in ecology_data if e["status"] in ["Yellow", "Red"])
    
    t_status = "В норме" if transport_issues == 0 else ("Предупреждение" if mock_data_service.current_scenario == "moderate" else "Критическое")
    e_status = "В норме" if ecology_issues == 0 else ("Предупреждение" if mock_data_service.current_scenario == "moderate" else "Критическое")
    
    risk = "Низкий"
    if mock_data_service.current_scenario == "critical":
        risk = "Высокий"
    elif mock_data_service.current_scenario == "moderate":
        risk = "Средний"
        
    kpi = 100 - (len(alerts) * 15)
    
    return CitySummary(
        transport_status=t_status,
        ecology_status=e_status,
        active_alerts=len(alerts),
        overall_risk_level=risk,
        kpi_score=max(0, kpi)
    )

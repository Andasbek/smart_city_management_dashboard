import math
from datetime import datetime, timedelta
from fastapi import APIRouter
from app.schemas.dashboard import CitySummary, TrendPoint, TrendsResponse
from app.services.mock_data_service import mock_data_service

router = APIRouter()

POINTS_COUNT = 12


def _compute_kpi(alerts_count: int) -> int:
    return max(0, 100 - alerts_count * 15)


def _build_summary() -> CitySummary:
    data = mock_data_service.get_current_data()
    alerts = data.get("alerts", [])
    transport_data = data.get("transport", [])
    ecology_data = data.get("ecology", [])

    transport_issues = sum(1 for t in transport_data if t["status"] in ["Yellow", "Red"])
    ecology_issues = sum(1 for e in ecology_data if e["status"] in ["Yellow", "Red"])

    scenario = mock_data_service.current_scenario
    t_status = "В норме" if transport_issues == 0 else ("Предупреждение" if scenario == "moderate" else "Критическое")
    e_status = "В норме" if ecology_issues == 0 else ("Предупреждение" if scenario == "moderate" else "Критическое")

    risk = "Низкий"
    if scenario == "critical":
        risk = "Высокий"
    elif scenario == "moderate":
        risk = "Средний"

    return CitySummary(
        transport_status=t_status,
        ecology_status=e_status,
        active_alerts=len(alerts),
        overall_risk_level=risk,
        kpi_score=_compute_kpi(len(alerts)),
    )


@router.get("/summary", response_model=CitySummary)
def get_dashboard_summary():
    return _build_summary()


@router.get("/trends", response_model=TrendsResponse)
def get_dashboard_trends():
    """
    Synthetic 12-hour history derived from current scenario.
    The latest point matches current state; earlier points wave around it
    so the dashboard shows believable movement without persisting history.
    """
    data = mock_data_service.get_current_data()
    transport_data = data.get("transport", [])
    ecology_data = data.get("ecology", [])
    alerts_count = len(data.get("alerts", []))
    scenario = mock_data_service.current_scenario

    avg_traffic = (
        sum(t.get("traffic_load", 0) for t in transport_data) / len(transport_data)
        if transport_data
        else 0
    )
    avg_aqi = (
        sum(e.get("aqi", 0) for e in ecology_data) / len(ecology_data)
        if ecology_data
        else 0
    )
    current_kpi = _compute_kpi(alerts_count)

    # Amplitude of historical wobble grows with severity
    severity_amp = {"normal": 4, "moderate": 8, "critical": 12}.get(scenario, 6)

    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    points: list[TrendPoint] = []
    for i in range(POINTS_COUNT):
        offset = POINTS_COUNT - 1 - i  # latest point is i == POINTS_COUNT - 1
        # Phase shift so each metric moves a bit independently
        wave_kpi = math.sin((i / POINTS_COUNT) * math.pi * 2 + 0.4) * severity_amp
        wave_traffic = math.sin((i / POINTS_COUNT) * math.pi * 2 + 1.2) * (severity_amp + 4)
        wave_aqi = math.cos((i / POINTS_COUNT) * math.pi * 2) * (severity_amp + 2)

        # Latest point clamps to actual current value, earlier points drift around it
        is_latest = offset == 0
        point_kpi = current_kpi if is_latest else max(0, min(100, round(current_kpi - wave_kpi)))
        point_traffic = round(avg_traffic) if is_latest else max(0, round(avg_traffic - wave_traffic))
        point_aqi = round(avg_aqi) if is_latest else max(0, round(avg_aqi - wave_aqi))
        point_alerts = alerts_count if is_latest else max(0, round(alerts_count + math.sin(i) * 0.6))

        label = (now - timedelta(hours=offset)).strftime("%H:00")
        points.append(
            TrendPoint(
                label=label,
                kpi=point_kpi,
                transport_load=point_traffic,
                ecology_aqi=point_aqi,
                alerts_count=point_alerts,
            )
        )

    return TrendsResponse(scenario=scenario, points=points)

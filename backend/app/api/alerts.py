from fastapi import APIRouter
from app.schemas.alert import AlertResponse
from app.services.mock_data_service import mock_data_service

router = APIRouter()

@router.get("/", response_model=AlertResponse)
def get_alerts():
    data = mock_data_service.get_current_data()
    return AlertResponse(alerts=data.get("alerts", []))

from fastapi import APIRouter
from app.schemas.transport import TransportResponse
from app.services.mock_data_service import mock_data_service

router = APIRouter()

@router.get("/metrics", response_model=TransportResponse)
def get_transport_metrics():
    data = mock_data_service.get_current_data()
    return TransportResponse(metrics=data.get("transport", []))

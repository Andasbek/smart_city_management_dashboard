from fastapi import APIRouter
from app.schemas.ecology import EcologyResponse
from app.services.mock_data_service import mock_data_service

router = APIRouter()

@router.get("/metrics", response_model=EcologyResponse)
def get_ecology_metrics():
    data = mock_data_service.get_current_data()
    return EcologyResponse(metrics=data.get("ecology", []))

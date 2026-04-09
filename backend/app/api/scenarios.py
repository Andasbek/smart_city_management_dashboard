from fastapi import APIRouter, HTTPException
from app.services.mock_data_service import mock_data_service

router = APIRouter()

@router.post("/{scenario_name}")
def set_scenario(scenario_name: str):
    try:
        mock_data_service.set_scenario(scenario_name)
        return {"status": "success", "current_scenario": scenario_name}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid scenario")

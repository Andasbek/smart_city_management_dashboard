import json
import os
from typing import Dict, Any

class MockDataService:
    def __init__(self):
        self.current_scenario = "normal"
        self.data = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        file_path = os.path.join(os.path.dirname(__file__), "..", "data", "scenarios.json")
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def set_scenario(self, scenario_name: str) -> None:
        if scenario_name in self.data:
            self.current_scenario = scenario_name
        else:
            raise ValueError("Scenario not found")

    def get_current_data(self) -> Dict[str, Any]:
        return self.data.get(self.current_scenario, {})

mock_data_service = MockDataService()

export const API_URL = "http://localhost:8000/api";

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_URL}/dashboard/summary`);
  return res.json();
}

export async function fetchTransportMetrics() {
  const res = await fetch(`${API_URL}/transport/metrics`);
  return res.json();
}

export async function fetchEcologyMetrics() {
  const res = await fetch(`${API_URL}/ecology/metrics`);
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${API_URL}/alerts/`);
  return res.json();
}

export async function setScenario(scenarioName: string) {
  const res = await fetch(`${API_URL}/scenarios/${scenarioName}`, {
    method: "POST"
  });
  return res.json();
}

export async function fetchAiInsights() {
  const res = await fetch(`${API_URL}/ai-insights/`);
  return res.json();
}

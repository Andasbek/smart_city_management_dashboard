export const API_URL = "http://localhost:8000/api";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type DashboardSummary = {
  transport_status: string;
  ecology_status: string;
  active_alerts: number;
  overall_risk_level: string;
  kpi_score: number;
};

export type AlertItem = {
  id: string;
  type: string;
  direction: string;
  district_name: string;
  severity: string;
  message: string;
  recommendation: string;
};

export type TransportMetric = {
  id: string;
  district_name: string;
  timestamp: string;
  traffic_load: number;
  avg_speed: number;
  incidents_count: number;
  congestion_level: string;
  status: string;
};

export type EcologyMetric = {
  id: string;
  district_name: string;
  timestamp: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  risk_level: string;
  status: string;
};

export type AIInsight = {
  summary: string;
  criticality: string;
  recommendations: string;
};

export type TrendPoint = {
  label: string;
  kpi: number;
  transport_load: number;
  ecology_aqi: number;
  alerts_count: number;
};

export type DashboardTrends = {
  scenario: string;
  points: TrendPoint[];
};

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_URL}/dashboard/summary`);
  return res.json() as Promise<DashboardSummary>;
}

export async function fetchDashboardTrends() {
  const res = await fetch(`${API_URL}/dashboard/trends`);
  return res.json() as Promise<DashboardTrends>;
}

export async function fetchTransportMetrics() {
  const res = await fetch(`${API_URL}/transport/metrics`);
  return res.json() as Promise<{ metrics: TransportMetric[] }>;
}

export async function fetchEcologyMetrics() {
  const res = await fetch(`${API_URL}/ecology/metrics`);
  return res.json() as Promise<{ metrics: EcologyMetric[] }>;
}

export async function fetchAlerts() {
  const res = await fetch(`${API_URL}/alerts/`);
  return res.json() as Promise<{ alerts: AlertItem[] }>;
}

export async function setScenario(scenarioName: string) {
  const res = await fetch(`${API_URL}/scenarios/${scenarioName}`, {
    method: "POST"
  });
  return res.json() as Promise<{ status: string; current_scenario: string }>;
}

export async function fetchCurrentScenario() {
  const res = await fetch(`${API_URL}/scenarios/current`);
  return res.json() as Promise<{ current_scenario: string }>;
}

export async function fetchAiInsights() {
  const res = await fetch(`${API_URL}/ai-insights/`);
  return res.json() as Promise<AIInsight>;
}

export async function sendAiChatMessage(messages: ChatMessage[]) {
  const res = await fetch(`${API_URL}/ai-chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  });

  if (!res.ok) {
    throw new Error("Failed to send chat message");
  }

  return res.json() as Promise<{ message: ChatMessage }>;
}

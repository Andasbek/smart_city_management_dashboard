"use client";
import React, { useEffect, useState } from "react";
import { AIInsight, AlertItem, DashboardSummary, fetchDashboardSummary, fetchAlerts, fetchAiInsights, setScenario } from "@/lib/api";
import KPISection from "@/components/KPISection";
import ScenarioSwitcher from "@/components/ScenarioSwitcher";
import AIInsightsCard from "@/components/AIInsightsCard";
import AlertsPanel from "@/components/AlertsPanel";
import AIChatPanel from "@/components/AIChatPanel";

export default function Dashboard() {
  const [scenario, setLocalScenario] = useState("normal");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (s: string) => {
    setLoading(true);
    try {
      await setScenario(s);
      const [sumRes, alertRes, aiRes] = await Promise.all([
        fetchDashboardSummary(),
        fetchAlerts(),
        fetchAiInsights()
      ]);
      setSummary(sumRes);
      setAlerts(alertRes.alerts);
      setAiInsight(aiRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData("normal");
  }, []);

  const handleScenarioSwitch = async (newScenario: string) => {
    setLocalScenario(newScenario);
    await loadData(newScenario);
  };

  return (
    <div>
      <header className="dashboard-header">
        <h1 className="heading-gradient" style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Управление Смарт-Сити</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Мониторинг в реальном времени и аналитика на базе AI</p>
      </header>

      <ScenarioSwitcher currentScenario={scenario} onSwitch={handleScenarioSwitch} />

      <div style={{ transition: "opacity 0.3s", opacity: loading ? 0.5 : 1 }}>
        <KPISection summary={summary} />

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <AIInsightsCard insight={aiInsight} />
            <div className="glass-panel" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <p>Динамические графики загружаются (Тренды транспорта и экологии)</p>
            </div>
            <AIChatPanel scenario={scenario} />
          </div>
          <div className="dashboard-side">
            <AlertsPanel alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}

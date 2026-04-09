"use client";
import React, { useEffect, useState } from "react";
import { fetchDashboardSummary, fetchAlerts, fetchAiInsights, setScenario } from "@/lib/api";
import KPISection from "@/components/KPISection";
import ScenarioSwitcher from "@/components/ScenarioSwitcher";
import AIInsightsCard from "@/components/AIInsightsCard";
import AlertsPanel from "@/components/AlertsPanel";

export default function Dashboard() {
  const [scenario, setLocalScenario] = useState("normal");
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState(null);
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
    loadData(scenario);
  }, []);

  const handleScenarioSwitch = async (newScenario: string) => {
    setLocalScenario(newScenario);
    await loadData(newScenario);
  };

  return (
    <div>
      <header style={{ marginBottom: "40px" }}>
        <h1 className="heading-gradient" style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Управление Смарт-Сити</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Мониторинг в реальном времени и аналитика на базе AI</p>
      </header>

      <ScenarioSwitcher currentScenario={scenario} onSwitch={handleScenarioSwitch} />

      <div style={{ transition: "opacity 0.3s", opacity: loading ? 0.5 : 1 }}>
        <KPISection summary={summary} />

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
          <div>
            <AIInsightsCard insight={aiInsight} />
            <div className="glass-panel" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <p>Динамические графики загружаются (Тренды транспорта и экологии)</p>
            </div>
          </div>
          <div>
            <AlertsPanel alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}

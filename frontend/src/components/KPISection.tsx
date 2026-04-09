"use client";
import { Activity, Car, Leaf, AlertTriangle } from "lucide-react";

export default function KPISection({ summary }: { summary: any }) {
  if (!summary) return <div className="glass-panel">Loading KPIs...</div>;

  const kpis = [
    { label: "Рейтинг KPI города", value: summary.kpi_score, icon: Activity, color: summary.kpi_score > 80 ? "var(--status-green)" : (summary.kpi_score > 50 ? "var(--status-yellow)" : "var(--status-red)") },
    { label: "Статус транспорта", value: summary.transport_status, icon: Car, color: summary.transport_status === "В норме" ? "var(--status-green)" : (summary.transport_status === "Предупреждение" ? "var(--status-yellow)" : "var(--status-red)") },
    { label: "Состояние экологии", value: summary.ecology_status, icon: Leaf, color: summary.ecology_status === "В норме" ? "var(--status-green)" : (summary.ecology_status === "Предупреждение" ? "var(--status-yellow)" : "var(--status-red)") },
    { label: "Общий риск", value: summary.overall_risk_level, icon: AlertTriangle, color: summary.overall_risk_level === "Низкий" ? "var(--status-green)" : (summary.overall_risk_level === "Средний" ? "var(--status-yellow)" : "var(--status-red)") },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "30px" }}>
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ padding: "16px", borderRadius: "12px", background: `color-mix(in srgb, ${kpi.color} 15%, transparent)` }}>
              <Icon size={32} color={kpi.color} />
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>{kpi.label}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";
import { AlertCircle } from "lucide-react";
import { AlertItem } from "@/lib/api";

export default function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="glass-panel" style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <AlertCircle color={"var(--status-red)"} />
        <h2 style={{ margin: 0 }}>Активные уведомления</h2>
        <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "10px", fontSize: "0.9rem" }}>
          {alerts?.length || 0}
        </span>
      </div>

      {!alerts || alerts.length === 0 ? (
        <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
          Активных уведомлений нет. В городе всё спокойно.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {alerts.map((alert) => (
            <div key={alert.id} style={{ 
              borderLeft: `4px solid ${alert.severity === "High" ? "var(--status-red)" : "var(--status-yellow)"}`,
              background: "rgba(0,0,0,0.2)",
              padding: "16px",
              borderRadius: "8px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{alert.direction === 'Transport' ? 'Транспорт' : (alert.direction === 'Ecology' ? 'Экология' : alert.direction)} - {alert.district_name}</span>
                <span style={{ fontSize: "0.8rem", color: alert.severity === "High" ? "var(--status-red)" : "var(--status-yellow)" }}>{alert.type}</span>
              </div>
              <p style={{ margin: "0 0 12px 0", fontSize: "0.95rem" }}>{alert.message}</p>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <strong>Рекомендация:</strong> {alert.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { BrainCircuit } from "lucide-react";
import { AIInsight } from "@/lib/api";

export default function AIInsightsCard({ insight }: { insight: AIInsight | null }) {
  if (!insight) return null;
  
  return (
    <div className="glass-panel" style={{ position: "relative", overflow: "hidden", marginBottom: "30px" }}>
      <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.1 }}>
        <BrainCircuit size={150} />
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <BrainCircuit color={"#a78bfa"} />
        <h2 className="heading-gradient" style={{ margin: 0 }}>AI Аналитика города</h2>
        <span style={{ 
          marginLeft: "auto", 
          fontSize: "0.8rem", 
          padding: "4px 12px", 
          borderRadius: "20px",
          background: insight.criticality === "Высокая" ? "var(--status-red)" : (insight.criticality === "Средняя" ? "var(--status-yellow)" : "var(--status-green)"),
          color: insight.criticality === "Средняя" ? "#000" : "#fff",
          fontWeight: 600
        }}>
          Риск: {insight.criticality}
        </span>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "var(--text-muted)", textTransform: "uppercase", fontSize: "0.8rem" }}>Краткая сводка ситуации</h4>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>{insight.summary}</p>
      </div>

      <div style={{ background: "rgba(59, 130, 246, 0.1)", borderLeft: "4px solid var(--accent)", padding: "16px", borderRadius: "4px" }}>
        <h4 style={{ color: "var(--accent)", textTransform: "uppercase", fontSize: "0.8rem", marginBottom: "8px" }}>Рекомендуемое действие</h4>
        <p style={{ margin: 0 }}>{insight.recommendations}</p>
      </div>
    </div>
  );
}

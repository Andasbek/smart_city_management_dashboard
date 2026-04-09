"use client";

export default function ScenarioSwitcher({ 
  currentScenario, 
  onSwitch 
}: { 
  currentScenario: string;
  onSwitch: (s: string) => void;
}) {
  const scenarios = [
    { id: "normal", label: "Нормальное состояние" },
    { id: "moderate", label: "Умеренная проблема" },
    { id: "critical", label: "Критическая ситуация" }
  ];

  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "30px", alignItems: "center" }}>
      <span style={{ color: "var(--text-muted)", fontWeight: 500, marginRight: "10px" }}>Сценарий:</span>
      {scenarios.map((s) => (
        <button
          key={s.id}
          className={`scenario-btn ${currentScenario === s.id ? "active" : ""}`}
          onClick={() => onSwitch(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

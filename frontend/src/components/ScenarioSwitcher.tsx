"use client";

import { CircleAlert, CircleCheck, CircleDot } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ScenarioId = "normal" | "moderate" | "critical";

const SCENARIOS: { id: ScenarioId; label: string; icon: LucideIcon }[] = [
  { id: "normal", label: "Норма", icon: CircleCheck },
  { id: "moderate", label: "Умеренная", icon: CircleDot },
  { id: "critical", label: "Критическая", icon: CircleAlert },
];

export default function ScenarioSwitcher({
  currentScenario,
  onSwitch,
  disabled,
}: {
  currentScenario: string;
  onSwitch: (s: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="scenario-switch" role="group" aria-label="Сценарий">
      <span className="scenario-switch__label">Сценарий</span>
      <div className="scenario-switch__group">
        {SCENARIOS.map((s) => {
          const Icon = s.icon;
          const active = currentScenario === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`scenario-pill${active ? " scenario-pill--active" : ""}`}
              onClick={() => onSwitch(s.id)}
              disabled={disabled}
              aria-pressed={active}
            >
              <Icon size={14} strokeWidth={2.2} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

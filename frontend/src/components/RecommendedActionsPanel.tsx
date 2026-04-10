"use client";

import { CheckCircle2, ListChecks } from "lucide-react";
import { AIInsight } from "@/lib/api";
import { Severity, severityLabel, textToSeverity } from "@/lib/severity";

type Action = {
  text: string;
  priority: Severity;
};

const PRIORITY_LABEL: Record<Severity, string> = {
  ok: "Low",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "High",
};

function splitRecommendations(text: string): string[] {
  return text
    .split(/(?:\n|;|\.\s|•|\d+\.\s)/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 6);
}

function buildActions(insight: AIInsight | null): Action[] {
  if (!insight) return [];
  const baseSeverity = textToSeverity(insight.criticality);
  const parts = splitRecommendations(insight.recommendations);

  const fallback: Action[] = [
    { text: insight.recommendations.trim(), priority: baseSeverity },
  ];

  const source = parts.length > 0 ? parts : fallback.map((a) => a.text);
  return source.slice(0, 4).map((text, idx) => {
    // First action keeps the base severity, later ones de-escalate by one rank
    const priority: Severity =
      idx === 0
        ? baseSeverity
        : idx === 1
          ? (baseSeverity === "critical" ? "high" : baseSeverity === "high" ? "medium" : "low")
          : "low";
    return { text: text.replace(/[.;]+$/u, ""), priority };
  });
}

export default function RecommendedActionsPanel({ insight }: { insight: AIInsight | null }) {
  const actions = buildActions(insight);

  return (
    <article className="card actions-card">
      <header className="actions-card__header">
        <span className="actions-card__icon">
          <ListChecks size={18} strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="text-h3">Recommended Actions</h2>
          <span className="text-micro">Приоритеты на основе AI-анализа</span>
        </div>
      </header>

      {actions.length === 0 ? (
        <div className="actions-card__empty">
          <CheckCircle2 size={20} />
          <span>Нет рекомендаций — обстановка штатная.</span>
        </div>
      ) : (
        <ol className="actions-list">
          {actions.map((action, idx) => (
            <li key={idx} className="actions-list__item">
              <span className="actions-list__index">{idx + 1}</span>
              <p className="actions-list__text">{action.text}</p>
              <span className={`badge badge--${action.priority}`}>
                {PRIORITY_LABEL[action.priority]}
              </span>
              <span className="visually-hidden">— приоритет {severityLabel(action.priority)}</span>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

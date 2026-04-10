"use client";

import { BrainCircuit, ScanLine, Sparkles, Target } from "lucide-react";
import { AIInsight } from "@/lib/api";
import { severityLabel, textToSeverity } from "@/lib/severity";

export default function AIInsightsCard({
  insight,
  generatedAt,
  aiActive,
}: {
  insight: AIInsight | null;
  generatedAt?: Date | null;
  aiActive?: boolean;
}) {
  if (!insight) {
    return (
      <article className="card ai-card ai-card--skeleton" aria-busy="true">
        <header className="ai-card__header">
          <span className="ai-card__icon"><BrainCircuit size={18} /></span>
          <h2 className="text-h3">AI Аналитика</h2>
        </header>
        <p className="text-muted">Готовим аналитическую сводку…</p>
      </article>
    );
  }

  const severity = textToSeverity(insight.criticality);
  const updatedLabel = generatedAt
    ? generatedAt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <article className="card ai-card">
      <header className="ai-card__header">
        <span className="ai-card__icon">
          <BrainCircuit size={18} strokeWidth={2.2} />
        </span>
        <div className="ai-card__title">
          <h2 className="text-h3">AI Аналитика</h2>
          <span className="text-micro">Executive summary</span>
        </div>
        <span className={`badge badge--${severity}`}>{severityLabel(severity)} риск</span>
      </header>

      <ul className="ai-card__rows">
        <li className="ai-card__row">
          <span className="ai-card__row-icon"><ScanLine size={14} /></span>
          <div>
            <span className="text-micro">Ситуация</span>
            <p className="text-body">{insight.summary}</p>
          </div>
        </li>
        <li className="ai-card__row">
          <span className="ai-card__row-icon"><Sparkles size={14} /></span>
          <div>
            <span className="text-micro">Критичность</span>
            <p className="text-body">{insight.criticality}</p>
          </div>
        </li>
        <li className="ai-card__row ai-card__row--accent">
          <span className="ai-card__row-icon"><Target size={14} /></span>
          <div>
            <span className="text-micro">Рекомендация</span>
            <p className="text-body">{insight.recommendations}</p>
          </div>
        </li>
      </ul>

      <footer className="ai-card__footer">
        <span className={`badge ${aiActive === false ? "badge--medium" : "badge--ok"} badge--dot`}>
          {aiActive === false ? "Fallback Mode" : "AI Active"}
        </span>
        {updatedLabel ? <span className="text-caption">Обновлено в {updatedLabel}</span> : null}
      </footer>
    </article>
  );
}

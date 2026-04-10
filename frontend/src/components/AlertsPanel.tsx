"use client";

import { AlertTriangle, Car, Leaf, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AlertItem } from "@/lib/api";
import { alertSeverity, severityLabel, severityRank } from "@/lib/severity";

function directionLabel(direction: string): string {
  if (direction === "Transport") return "Транспорт";
  if (direction === "Ecology") return "Экология";
  return direction;
}

function directionIcon(direction: string): LucideIcon {
  if (direction === "Transport" || direction === "Транспорт") return Car;
  if (direction === "Ecology" || direction === "Экология") return Leaf;
  return AlertTriangle;
}

export default function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  const sorted = [...(alerts ?? [])].sort(
    (a, b) => severityRank(alertSeverity(b.severity)) - severityRank(alertSeverity(a.severity)),
  );

  return (
    <article className="card alerts-card">
      <header className="alerts-card__header">
        <span className="alerts-card__icon">
          <AlertTriangle size={18} strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="text-h3">Лента инцидентов</h2>
          <span className="text-micro">Сортировка по критичности</span>
        </div>
        <span className="badge badge--neutral">{sorted.length}</span>
      </header>

      {sorted.length === 0 ? (
        <div className="alerts-card__empty">
          <ShieldCheck size={24} />
          <p className="text-secondary">В городе всё спокойно. Активных оповещений нет.</p>
        </div>
      ) : (
        <ul className="alerts-feed">
          {sorted.map((alert) => {
            const severity = alertSeverity(alert.severity);
            const Icon = directionIcon(alert.direction);
            return (
              <li key={alert.id} className={`alert-item alert-item--${severity}`}>
                <span className={`alert-item__rail alert-item__rail--${severity}`} />
                <div className="alert-item__main">
                  <div className="alert-item__head">
                    <span className="alert-item__direction">
                      <Icon size={14} strokeWidth={2.2} />
                      {directionLabel(alert.direction)} · {alert.district_name}
                    </span>
                    <span className={`badge badge--${severity}`}>{severityLabel(severity)}</span>
                  </div>
                  <p className="alert-item__message">{alert.message}</p>
                  <p className="alert-item__action">
                    <span className="text-micro">Действие</span>
                    <span>{alert.recommendation}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

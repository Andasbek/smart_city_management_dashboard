"use client";

import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Car, Leaf } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { DashboardSummary, DashboardTrends } from "@/lib/api";
import { Severity, riskToSeverity, severityLabel, textToSeverity } from "@/lib/severity";

type KpiCard = {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
  severity: Severity;
  icon: LucideIcon;
  series: number[];
  invert?: boolean; // when true, "up" means worse (e.g. alerts, traffic load)
};

function kpiSeverityFromScore(score: number): Severity {
  if (score >= 85) return "ok";
  if (score >= 65) return "medium";
  if (score >= 40) return "high";
  return "critical";
}

function alertsSeverity(count: number): Severity {
  if (count === 0) return "ok";
  if (count <= 1) return "medium";
  if (count <= 3) return "high";
  return "critical";
}

function computeDelta(series: number[]): { delta: number; direction: "up" | "down" | "flat" } {
  if (series.length < 2) return { delta: 0, direction: "flat" };
  const first = series[0];
  const last = series[series.length - 1];
  if (first === 0) return { delta: 0, direction: "flat" };
  const pct = ((last - first) / Math.abs(first)) * 100;
  if (Math.abs(pct) < 1) return { delta: 0, direction: "flat" };
  return { delta: pct, direction: pct > 0 ? "up" : "down" };
}

function Sparkline({ data, severity }: { data: number[]; severity: Severity }) {
  const series = data.map((value, idx) => ({ idx, value }));
  const stroke = `var(--severity-${severity})`;
  const gradientId = `spark-${severity}`;

  return (
    <div className="kpi-card__spark">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.18} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendBadge({
  series,
  invert,
}: {
  series: number[];
  invert?: boolean;
}) {
  const { delta, direction } = computeDelta(series);

  if (direction === "flat" || series.length < 2) {
    return (
      <span className="kpi-card__trend kpi-card__trend--flat">
        <ArrowRight size={12} strokeWidth={2.4} />
        <span>стабильно</span>
      </span>
    );
  }

  const isWorse = invert ? direction === "up" : direction === "down";
  const tone = isWorse ? "kpi-card__trend--bad" : "kpi-card__trend--good";
  const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;
  const sign = direction === "up" ? "+" : "−";

  return (
    <span className={`kpi-card__trend ${tone}`}>
      <Icon size={12} strokeWidth={2.4} />
      <span>{`${sign}${Math.abs(delta).toFixed(1)}%`}</span>
    </span>
  );
}

export default function KPISection({
  summary,
  trends,
}: {
  summary: DashboardSummary | null;
  trends: DashboardTrends | null;
}) {
  if (!summary) {
    return (
      <div className="kpi-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card kpi-card kpi-card--skeleton" aria-hidden />
        ))}
      </div>
    );
  }

  const points = trends?.points ?? [];
  const kpiSeries = points.map((p) => p.kpi);
  const trafficSeries = points.map((p) => p.transport_load);
  const aqiSeries = points.map((p) => p.ecology_aqi);
  const alertsSeries = points.map((p) => p.alerts_count);

  const cards: KpiCard[] = [
    {
      key: "kpi",
      label: "Индекс состояния города",
      value: summary.kpi_score,
      severity: kpiSeverityFromScore(summary.kpi_score),
      icon: Activity,
      series: kpiSeries,
    },
    {
      key: "transport",
      label: "Транспорт",
      value: summary.transport_status,
      severity: textToSeverity(summary.transport_status),
      icon: Car,
      series: trafficSeries,
      invert: true,
    },
    {
      key: "ecology",
      label: "Экология",
      value: summary.ecology_status,
      severity: textToSeverity(summary.ecology_status),
      icon: Leaf,
      series: aqiSeries,
      invert: true,
    },
    {
      key: "alerts",
      label: "Активные оповещения",
      value: summary.active_alerts,
      severity: alertsSeverity(summary.active_alerts),
      icon: AlertTriangle,
      series: alertsSeries,
      invert: true,
    },
  ];

  // The "overall risk" gets folded into the KPI card sub-line so we still surface it.
  const overallRiskSeverity = riskToSeverity(summary.overall_risk_level);

  return (
    <div className="kpi-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className="card kpi-card">
            <header className="kpi-card__header">
              <span className={`kpi-card__icon kpi-card__icon--${card.severity}`}>
                <Icon size={18} strokeWidth={2.2} />
              </span>
              <span className={`badge badge--${card.severity}`}>{severityLabel(card.severity)}</span>
            </header>

            <div className="kpi-card__body">
              <div className="kpi-card__value">
                {card.value}
                {card.unit ? <span className="kpi-card__unit">{card.unit}</span> : null}
              </div>
              <div className="kpi-card__label">{card.label}</div>
            </div>

            <footer className="kpi-card__footer">
              <TrendBadge series={card.series} invert={card.invert} />
              <Sparkline data={card.series.length > 0 ? card.series : [0, 0]} severity={card.severity} />
            </footer>

            {card.key === "kpi" ? (
              <div className="kpi-card__meta">
                Общий риск ·{" "}
                <span className={`kpi-card__meta-value kpi-card__meta-value--${overallRiskSeverity}`}>
                  {summary.overall_risk_level}
                </span>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

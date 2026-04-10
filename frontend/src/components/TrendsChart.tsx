"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardTrends } from "@/lib/api";

const SERIES = [
  {
    key: "kpi" as const,
    label: "Индекс города",
    color: "#2563eb",
    gradient: "trend-grad-kpi",
  },
  {
    key: "transport_load" as const,
    label: "Загрузка дорог",
    color: "#ea580c",
    gradient: "trend-grad-traffic",
  },
  {
    key: "ecology_aqi" as const,
    label: "AQI",
    color: "#7c3aed",
    gradient: "trend-grad-aqi",
  },
];

export default function TrendsChart({ trends }: { trends: DashboardTrends | null }) {
  const points = trends?.points ?? [];

  return (
    <article className="card trends-card">
      <header className="trends-card__header">
        <span className="trends-card__icon">
          <TrendingUp size={18} strokeWidth={2.2} />
        </span>
        <div>
          <h2 className="text-h3">Тренды за 12 часов</h2>
          <span className="text-micro">KPI · Загрузка дорог · AQI</span>
        </div>
        <ul className="trends-card__legend">
          {SERIES.map((s) => (
            <li key={s.key}>
              <span className="trends-card__dot" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      </header>

      <div className="trends-card__chart">
        {points.length === 0 ? (
          <div className="trends-card__empty">Нет данных для отображения трендов.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.gradient} id={s.gradient} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.20} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
                  fontSize: 12,
                  color: "#0f172a",
                }}
                labelStyle={{ color: "#0f172a", fontWeight: 600 }}
              />
              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#${s.gradient})`}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </article>
  );
}

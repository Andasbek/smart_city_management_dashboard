"use client";
import React, { useEffect, useState } from "react";
import { fetchEcologyMetrics } from "@/lib/api";

export default function EcologyPage() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    fetchEcologyMetrics().then((res) => setMetrics(res.metrics || []));
  }, []);

  return (
    <div>
      <h1 className="heading-gradient" style={{ fontSize: "2rem", marginBottom: "20px" }}>Экологический модуль</h1>
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1fr 1fr" }}>
        {metrics.map(m => (
          <div key={m.id} className="glass-panel" style={{ borderLeft: `4px solid var(--status-${m.status === 'Green' ? 'green' : m.status === 'Yellow' ? 'yellow' : 'red'})` }}>
            <h3>Район: {m.district_name}</h3>
            <p>AQI (Индекс качества воздуха): {m.aqi}</p>
            <p>PM2.5: {m.pm25} мкг/м³</p>
            <p>PM10: {m.pm10} мкг/м³</p>
            <p>Уровень риска: {m.risk_level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

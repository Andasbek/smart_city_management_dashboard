"use client";
import React, { useEffect, useState } from "react";
import { fetchTransportMetrics } from "@/lib/api";

export default function TransportPage() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    fetchTransportMetrics().then((res) => setMetrics(res.metrics || []));
  }, []);

  return (
    <div>
      <h1 className="heading-gradient" style={{ fontSize: "2rem", marginBottom: "20px" }}>Транспортный модуль</h1>
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1fr 1fr" }}>
        {metrics.map(m => (
          <div key={m.id} className="glass-panel" style={{ borderLeft: `4px solid var(--status-${m.status === 'Green' ? 'green' : m.status === 'Yellow' ? 'yellow' : 'red'})` }}>
            <h3>Район: {m.district_name}</h3>
            <p>Загруженность дорог: {m.traffic_load}%</p>
            <p>Средняя скорость: {m.avg_speed} км/ч</p>
            <p>Уровень пробок: {m.congestion_level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

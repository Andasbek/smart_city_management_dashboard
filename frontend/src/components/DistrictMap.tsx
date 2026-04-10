"use client";

import { MapPin } from "lucide-react";
import { EcologyMetric, TransportMetric } from "@/lib/api";
import { Severity, severityLabel, severityRank, statusToSeverity } from "@/lib/severity";

type DistrictTile = {
  name: string;
  severity: Severity;
  trafficLoad?: number;
  avgSpeed?: number;
  aqi?: number;
  pm25?: number;
};

function mergeDistricts(transport: TransportMetric[], ecology: EcologyMetric[]): DistrictTile[] {
  const tiles = new Map<string, DistrictTile>();

  for (const t of transport) {
    tiles.set(t.district_name, {
      name: t.district_name,
      severity: statusToSeverity(t.status),
      trafficLoad: t.traffic_load,
      avgSpeed: t.avg_speed,
    });
  }

  for (const e of ecology) {
    const existing = tiles.get(e.district_name);
    const ecoSeverity = statusToSeverity(e.status);
    if (existing) {
      const worst =
        severityRank(ecoSeverity) > severityRank(existing.severity) ? ecoSeverity : existing.severity;
      tiles.set(e.district_name, {
        ...existing,
        severity: worst,
        aqi: e.aqi,
        pm25: e.pm25,
      });
    } else {
      tiles.set(e.district_name, {
        name: e.district_name,
        severity: ecoSeverity,
        aqi: e.aqi,
        pm25: e.pm25,
      });
    }
  }

  return Array.from(tiles.values()).sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity),
  );
}

const LEGEND: { severity: Severity; label: string }[] = [
  { severity: "ok", label: "В норме" },
  { severity: "medium", label: "Внимание" },
  { severity: "critical", label: "Критично" },
];

export default function DistrictMap({
  transport,
  ecology,
}: {
  transport: TransportMetric[];
  ecology: EcologyMetric[];
}) {
  const tiles = mergeDistricts(transport, ecology);

  return (
    <article className="card district-map">
      <header className="district-map__header">
        <div className="district-map__title">
          <span className="district-map__icon">
            <MapPin size={18} strokeWidth={2.2} />
          </span>
          <div>
            <h2 className="text-h3">Карта районов</h2>
            <span className="text-micro">Severity по объединённым метрикам</span>
          </div>
        </div>
        <ul className="district-map__legend">
          {LEGEND.map((item) => (
            <li key={item.severity}>
              <span className={`district-map__dot district-map__dot--${item.severity}`} />
              {item.label}
            </li>
          ))}
        </ul>
      </header>

      {tiles.length === 0 ? (
        <p className="text-muted">Нет данных по районам.</p>
      ) : (
        <div className="district-map__grid">
          {tiles.map((tile) => (
            <div key={tile.name} className={`district-tile district-tile--${tile.severity}`}>
              <div className="district-tile__head">
                <span className="district-tile__name">{tile.name}</span>
                <span className={`badge badge--${tile.severity}`}>{severityLabel(tile.severity)}</span>
              </div>
              <dl className="district-tile__stats">
                {tile.trafficLoad !== undefined ? (
                  <div>
                    <dt>Загрузка</dt>
                    <dd>{tile.trafficLoad}%</dd>
                  </div>
                ) : null}
                {tile.avgSpeed !== undefined ? (
                  <div>
                    <dt>Скорость</dt>
                    <dd>{tile.avgSpeed} км/ч</dd>
                  </div>
                ) : null}
                {tile.aqi !== undefined ? (
                  <div>
                    <dt>AQI</dt>
                    <dd>{tile.aqi}</dd>
                  </div>
                ) : null}
                {tile.pm25 !== undefined ? (
                  <div>
                    <dt>PM2.5</dt>
                    <dd>{tile.pm25}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { AlertItem, fetchAlerts } from "@/lib/api";
import AlertsPanel from "@/components/AlertsPanel";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    fetchAlerts().then((res) => setAlerts(res.alerts || []));
  }, []);

  return (
    <div>
      <h1 className="heading-gradient" style={{ fontSize: "2rem", marginBottom: "20px" }}>Системные уведомления</h1>
      <div style={{ maxWidth: "800px" }}>
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import {
  AIInsight,
  fetchAiInsights,
  fetchCurrentScenario,
  setScenario,
} from "@/lib/api";
import AIChatPanel from "@/components/AIChatPanel";
import AIInsightsCard from "@/components/AIInsightsCard";
import RecommendedActionsPanel from "@/components/RecommendedActionsPanel";
import ScenarioSwitcher from "@/components/ScenarioSwitcher";

function formatRelative(date: Date | null): string {
  if (!date) return "—";
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 5) return "только что";
  if (seconds < 60) return `${seconds} сек назад`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} мин назад`;
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function AIPage() {
  const [scenario, setLocalScenario] = useState("normal");
  const [scenarioReady, setScenarioReady] = useState(false);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInsight = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const aiRes = await fetchAiInsights();
      setInsight(aiRes);
      setUpdatedAt(new Date());
    } catch (e) {
      console.error(e);
      setError("Не удалось получить AI-аналитику. Проверьте, что backend запущен.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync with backend's current scenario on mount, then load insight
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { current_scenario } = await fetchCurrentScenario();
        if (cancelled) return;
        setLocalScenario(current_scenario);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setScenarioReady(true);
          await loadInsight();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadInsight]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  const handleScenarioSwitch = async (newScenario: string) => {
    setLocalScenario(newScenario);
    try {
      await setScenario(newScenario);
      await loadInsight();
    } catch (e) {
      console.error(e);
      setError("Не удалось переключить сценарий.");
    }
  };

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero__intro">
          <span className="text-micro">
            <Sparkles size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />
            AI Operations
          </span>
          <h1 className="text-h1 heading-gradient">AI-центр анализа</h1>
          <p className="text-lead">
            Сводка ситуации, приоритеты и интерактивный диалог с моделью — всё в одном месте.
          </p>
        </div>
        <div className="dashboard-hero__controls">
          <ScenarioSwitcher
            currentScenario={scenario}
            onSwitch={handleScenarioSwitch}
            disabled={loading || !scenarioReady}
          />
          <div className="dashboard-hero__meta">
            <span className="text-caption">Обновлено: {formatRelative(updatedAt)}</span>
            <button
              type="button"
              className="dashboard-hero__refresh"
              onClick={() => void loadInsight()}
              disabled={loading}
              aria-label="Обновить AI-аналитику"
            >
              <RefreshCw size={14} strokeWidth={2.4} className={loading ? "spin" : undefined} />
              <span>Обновить</span>
            </button>
          </div>
        </div>
      </section>

      {error ? <div className="dashboard-error">{error}</div> : null}

      <div className={`dashboard-stage${loading ? " dashboard-stage--loading" : ""}`}>
        <div className="grid-12">
          <div className="col-span-7">
            <AIInsightsCard insight={insight} generatedAt={updatedAt} aiActive />
          </div>
          <div className="col-span-5">
            <RecommendedActionsPanel insight={insight} />
          </div>
          <div className="col-span-12">
            <AIChatPanel scenario={scenario} />
          </div>
        </div>
      </div>
    </div>
  );
}

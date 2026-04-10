export type Severity = "ok" | "low" | "medium" | "high" | "critical";

const STATUS_TO_SEVERITY: Record<string, Severity> = {
  Green: "ok",
  Yellow: "medium",
  Red: "critical",
};

const RISK_TO_SEVERITY: Record<string, Severity> = {
  "Низкий": "ok",
  "Средний": "medium",
  "Высокий": "critical",
};

const TEXT_TO_SEVERITY: Record<string, Severity> = {
  "В норме": "ok",
  "Предупреждение": "medium",
  "Критическое": "critical",
  "Низкая": "ok",
  "Средняя": "medium",
  "Высокая": "critical",
};

const ALERT_SEVERITY: Record<string, Severity> = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Critical: "critical",
};

export function statusToSeverity(status: string): Severity {
  return STATUS_TO_SEVERITY[status] ?? "ok";
}

export function riskToSeverity(risk: string): Severity {
  return RISK_TO_SEVERITY[risk] ?? "ok";
}

export function textToSeverity(text: string): Severity {
  return TEXT_TO_SEVERITY[text] ?? "ok";
}

export function alertSeverity(severity: string): Severity {
  return ALERT_SEVERITY[severity] ?? "medium";
}

export function severityLabel(severity: Severity): string {
  switch (severity) {
    case "ok":
      return "В норме";
    case "low":
      return "Низкий";
    case "medium":
      return "Средний";
    case "high":
      return "Высокий";
    case "critical":
      return "Критический";
  }
}

export function severityColorVar(severity: Severity): string {
  return `var(--severity-${severity})`;
}

export function severityRank(severity: Severity): number {
  return ["ok", "low", "medium", "high", "critical"].indexOf(severity);
}

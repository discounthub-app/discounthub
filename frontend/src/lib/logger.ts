export type LogPayload = {
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  time?: string;
};

const KEY = "__logs__";

export function logError(err: unknown, context?: Record<string, unknown>) {
  const payload: LogPayload = {
    level: "error",
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context,
    time: new Date().toISOString(),
  };
  try {
    const buf: LogPayload[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    buf.push(payload);
    if (buf.length > 100) buf.shift();
    localStorage.setItem(KEY, JSON.stringify(buf));
  } catch {}
  // eslint-disable-next-line no-console
  console.error("[DH]", payload.message, payload);
}

export function setupGlobalErrorLogging() {
  window.addEventListener("error", (e) =>
    logError((e as ErrorEvent).error ?? (e as ErrorEvent).message, { source: "window.error" })
  );
  window.addEventListener("unhandledrejection", (e) =>
    logError((e as PromiseRejectionEvent).reason, { source: "unhandledrejection" })
  );

  const orig = console.error;
  console.error = (...args: unknown[]) => {
    logError(new Error(args.map(String).join(" ")), { source: "console.error" });
    orig(...args);
  };
}

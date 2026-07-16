import { SpanStatusCode, trace } from '@opentelemetry/api'

function getSpan() {
  const span = trace.getActiveSpan()
  return span
}

export function recordWideEvent(attributes: Record<string, any>) {
  const span = getSpan()
  if (!span) return

  span.setAttributes(attributes)
}

export function recordError(err: unknown) {
  const span = getSpan()
  if (!span) return

  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: err instanceof Error ? err.message : String(err)
  })

  span.recordException(err instanceof Error ? err : String(err))

  return span.spanContext().traceId
}

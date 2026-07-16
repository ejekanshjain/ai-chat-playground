import { SpanStatusCode } from '@opentelemetry/api'
import {
  ConsoleSpanExporter,
  ReadableSpan,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base'
import { registerOTel } from '@vercel/otel'

class SmartSamplingSpanProcessor extends SimpleSpanProcessor {
  onEnd(span: ReadableSpan): void {
    const isError = span.status.code === SpanStatusCode.ERROR
    const isSlow = span.duration[0] * 1000 + span.duration[1] / 1e6 > 5000
    const isLucky = Math.random() < 0 // Adjust this value to adjust the sampling rate for non-error and non-slow spans

    if (isError || isSlow || isLucky) {
      super.onEnd(span)
    }
  }
}

export function register() {
  registerOTel({
    serviceName: 'my-nextjs-app',
    spanProcessors: [new SmartSamplingSpanProcessor(new ConsoleSpanExporter())]
  })
}

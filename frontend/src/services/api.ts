import { 
  InvestigationReport, 
  InvestigationEvent, 
  DemoScenario, 
  UrlValidationResult 
} from '../types';

const API_BASE = '/api';

export async function validateUrl(url: string): Promise<UrlValidationResult> {
  const res = await fetch(`${API_BASE}/validate-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to validate URL');
  }
  return res.json();
}

export async function fetchDemoScenarios(): Promise<DemoScenario[]> {
  const res = await fetch(`${API_BASE}/demo/scenarios`);
  if (!res.ok) throw new Error('Failed to load demo scenarios');
  return res.json();
}

export async function fetchInvestigationHistory(): Promise<InvestigationReport[]> {
  const res = await fetch(`${API_BASE}/investigations`);
  if (!res.ok) throw new Error('Failed to load investigations history');
  return res.json();
}

export async function fetchInvestigationReport(id: string): Promise<InvestigationReport> {
  const res = await fetch(`${API_BASE}/investigations/${id}`);
  if (!res.ok) throw new Error('Investigation not found');
  return res.json();
}

/**
 * Initiates investigation and streams real-time SSE events
 */
export function streamInvestigation(
  url: string,
  scenarioId?: string,
  onEvent?: (event: InvestigationEvent) => void,
  onComplete?: (report: InvestigationReport) => void,
  onError?: (error: string) => void
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${API_BASE}/investigate/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          scenario_id: scenarioId,
          browser_profile: 'lite',
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          const linesInBlock = block.split('\n');
          for (const line of linesInBlock) {
            if (line.startsWith('data: ')) {
              const rawData = line.slice(6).trim();
              if (!rawData) continue;
              try {
                const parsed = JSON.parse(rawData);
                if (parsed.event_type === 'complete' && parsed.payload?.report) {
                  onComplete?.(parsed.payload.report);
                } else if (parsed.event_type === 'error') {
                  onError?.(parsed.message || 'Investigation error occurred');
                } else {
                  onEvent?.(parsed as InvestigationEvent);
                }
              } catch (e) {
                console.error('Failed to parse SSE payload', e);
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Investigation stream failed:', err);
        onError?.(err.message || 'Stream connection error');
      }
    }
  })();

  // Return cancel function
  return () => {
    controller.abort();
  };
}


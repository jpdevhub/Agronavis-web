/** Public by design: the URL carries no credential. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export type FormEndpoint = 'contact' | 'demo' | 'careers' | 'newsletter';

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };

export async function submitForm(
  endpoint: FormEndpoint,
  payload: Record<string, string>,
): Promise<SubmitResult> {
  try {
    const response = await fetch(`${API_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: unknown = await response.json().catch(() => null);
    const body = (data ?? {}) as { ok?: boolean; error?: string; fields?: Record<string, string> };

    if (response.ok && body.ok) return { ok: true };

    return {
      ok: false,
      error: body.error ?? 'That did not go through. Please try again.',
      ...(body.fields ? { fields: body.fields } : {}),
    };
  } catch {
    return {
      ok: false,
      error: 'Could not reach the server. Check your connection and try again.',
    };
  }
}

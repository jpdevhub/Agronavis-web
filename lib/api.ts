/** Public by design: the URL carries no credential. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export type FormEndpoint = 'contact' | 'demo' | 'careers' | 'newsletter';

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };

export async function submitForm(
  endpoint: FormEndpoint,
  payload: Record<string, string> | FormData,
): Promise<SubmitResult> {
  try {
    const isFormData = payload instanceof FormData;
    const response = await fetch(`${API_URL}/api/${endpoint}`, {
      method: 'POST',
      // FormData sets its own multipart boundary; setting the header breaks it.
      ...(isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }),
      body: isFormData ? payload : JSON.stringify(payload),
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

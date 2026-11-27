/** Capture success or error without throwing through RSC boundaries awkwardly. */
export async function loadApi<T>(
  fn: () => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; error: unknown }> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    return { ok: false, error };
  }
}

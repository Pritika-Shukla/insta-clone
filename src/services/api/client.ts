export async function apiFetch<T>(
  url: string,
  headers?: Record<string, string>,
): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

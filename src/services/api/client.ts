
const normalizeUrl = (url: string) => url.replace('/v1/v1/', '/v1/');

export async function apiFetch<T>(
  url: string,
  headers?: Record<string, string>,
): Promise<T> {
  const res = await fetch(normalizeUrl(url), { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

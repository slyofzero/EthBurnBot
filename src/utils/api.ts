export async function apiFetcher<T>(url: string) {
  const response = await fetch(url);
  console.log(await response.text());
  const data = (await response.json()) as T;

  return { response: response.status, data };
}

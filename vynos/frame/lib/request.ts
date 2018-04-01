export default async function requestJson<T> (url: RequestInfo, options?: RequestInit): Promise<T> {
  const res = await request(url, options)
  return res.json() as Promise<T>
}


export async function request (url: RequestInfo, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options)

  if (res.status < 200 || res.status > 299) {
    throw new Error('Failed to fetch.')
  }

  return res
}

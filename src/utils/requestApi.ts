// requestApi.ts
import { useAuth0 } from '@auth0/auth0-vue'

export default function requestApi(
  url: string,
  method: string = 'GET',
  body: unknown = null
) {
  return async function fetchData() {
    const { getAccessTokenSilently } = useAuth0()
    const token = await getAccessTokenSilently()

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!res.ok) {
      throw new Error(`API ${method} ${url} failed (${res.status})`)
    }
    return res.json()
  }
}

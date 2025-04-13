import { useAuth0 } from '@auth0/auth0-vue'

export default function requestApi(url: string, method: string = 'GET') {
  const { getAccessTokenSilently } = useAuth0()
  let accessToken: string | null = null

  const getAccessToken = async () => {
    accessToken = await getAccessTokenSilently()
  }

  const getRequestHeaders = async () => {
    await getAccessToken()
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchData = async () => {
    const headers = await getRequestHeaders()
    const response = await fetch(url, {
      method,
      headers,
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }

  return fetchData
}

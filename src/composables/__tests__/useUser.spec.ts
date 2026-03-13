import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUser, type User } from '../useUser'

const mockToken = 'test-token'

vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken),
  }),
}))

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  image: null,
  telegram_link_token: 'abc123',
  telegram_chat_id: null,
  premium: true,
}

describe('useUser', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    import.meta.env.VITE_API_URL = 'http://localhost:3000/'
  })

  it('fetches user and exposes data', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response)

    const { user, loading, fetchUser } = useUser()

    expect(user.value).toBeNull()
    await fetchUser()

    expect(user.value).toEqual(mockUser)
    expect(loading.value).toBe(false)
  })

  it('sets premium to true when API returns premium: true', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockUser, premium: true }),
    } as Response)

    const { user, fetchUser } = useUser()
    await fetchUser()

    expect(user.value?.premium).toBe(true)
  })

  it('sets premium to false for free users', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockUser, premium: false }),
    } as Response)

    const { user, fetchUser } = useUser()
    await fetchUser()

    expect(user.value?.premium).toBe(false)
  })

  it('sets error on failed response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unauthorized' }),
    } as Response)

    const { user, error, fetchUser } = useUser()
    await fetchUser()

    expect(user.value).toBeNull()
    expect(error.value).toBe('Unauthorized')
  })
})

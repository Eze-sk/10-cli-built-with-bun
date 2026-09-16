import keytar from 'keytar'

import { GetApiKey, SetApiKey } from '../keychain'

vi.mock('keytar', () => ({
  default: {
    setPassword: vi.fn(),
    getPassword: vi.fn()
  }
}))

describe('API Key Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('SetApiKey', () => {
    it('should save the API key correctly if it passes validation.', async () => {
      const validKey = 'valid-api-key-12345'
      vi.mocked(keytar.setPassword).mockResolvedValue(undefined)

      const result = await SetApiKey(validKey)

      expect(keytar.setPassword).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        validKey.trim()
      )
      expect(result).toEqual({ key: validKey })
    })

    it('should return an error if Zod validation fails.', async () => {
      const invalidKey = ''

      const result = await SetApiKey(invalidKey)

      expect(keytar.setPassword).not.toHaveBeenCalled()
      expect(result.error).toBeDefined()
      expect(result.key).toBe('')
    })

    it('should return an error if keytar.setPassword fails.', async () => {
      const validKey = 'valid-api-key-12345'
      vi.mocked(keytar.setPassword).mockRejectedValue(
        new Error('Keychain error')
      )

      const result = await SetApiKey(validKey)

      expect(result).toEqual({
        error: 'Keychain error',
        key: ''
      })
    })
  })

  describe('GetApiKey', () => {
    it('should return the stored API key', async () => {
      const storedKey = 'my-stored-key'
      vi.mocked(keytar.getPassword).mockResolvedValue(storedKey)

      const result = await GetApiKey()

      expect(keytar.getPassword).toHaveBeenCalled()
      expect(result).toEqual({ key: storedKey })
    })

    it('should return null if there is no saved API key.', async () => {
      vi.mocked(keytar.getPassword).mockResolvedValue(null)

      const result = await GetApiKey()

      expect(result).toEqual({ key: null })
    })

    it('should return an error if keytar.getPassword fails.', async () => {
      vi.mocked(keytar.getPassword).mockRejectedValue(
        new Error('Access denied')
      )

      const result = await GetApiKey()

      expect(result).toEqual({
        key: '',
        error: 'Access denied'
      })
    })
  })
})

import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogle } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'

import { getModel, providerDetector } from '../provider-detector'

vi.mock('@ai-sdk/openai', () => ({ createOpenAI: vi.fn(() => vi.fn()) }))
vi.mock('@ai-sdk/anthropic', () => ({ createAnthropic: vi.fn(() => vi.fn()) }))
vi.mock('@ai-sdk/google', () => ({ createGoogle: vi.fn(() => vi.fn()) }))
vi.mock('@ai-sdk/deepseek', () => ({ createDeepSeek: vi.fn(() => vi.fn()) }))

describe('providerDetector', () => {
  it.each([
    { key: 'sk-proj-1234567890abcdef', expectedProvider: 'openai' },
    { key: 'sk-admin-1234567890abcdef', expectedProvider: 'openai' },
    { key: 'sk-ant-api03-1234567890', expectedProvider: 'anthropic' },
    { key: 'AIzaSyD-1234567890abcdef', expectedProvider: 'gemini' },
    { key: 'AQ.1234567890abcdef', expectedProvider: 'gemini' },
    {
      key: 'sk-0123456789abcdef0123456789abcdef',
      expectedProvider: 'deepseek'
    },
    { key: 'sk-abc123DEF456ghi789JKL012mno345pqr', expectedProvider: 'openai' },
    { key: 'invalid_key_format', expectedProvider: 'unknown' },
    { key: 'sk-short', expectedProvider: 'unknown' }
  ])(
    'must detect $expectedProvider for the key $key',
    ({ key, expectedProvider }) => {
      const result = providerDetector(key)
      expect(result.provider).toBe(expectedProvider)
      expect(result.apiKey).toBe(key)
    }
  )

  it('It must return an error when the API key is not provided.', () => {
    const result = providerDetector('')
    expect(result).toEqual({
      provider: 'unknown',
      error: 'API key not provided',
      apiKey: ''
    })
  })
})

describe('getModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create an instance of the OpenAI model with the correct name.', () => {
    const key = 'sk-proj-testkey123'
    getModel(key)

    expect(createOpenAI).toHaveBeenCalledWith({ apiKey: key })
    const openaiInstance = vi.mocked(createOpenAI).mock.results[0]?.value
    expect(openaiInstance).toHaveBeenCalledWith('gpt-4o-mini')
  })

  it('should instantiate the Anthropic model with the correct name.', () => {
    const key = 'sk-ant-testkey123'
    getModel(key)

    expect(createAnthropic).toHaveBeenCalledWith({ apiKey: key })
    const anthropicInstance = vi.mocked(createAnthropic).mock.results[0]?.value
    expect(anthropicInstance).toHaveBeenCalledWith('claude-3-5-haiku-20241022')
  })

  it('should instantiate the Gemini model with the correct name.', () => {
    const key = 'AIzaSyTestKey123'
    getModel(key)

    expect(createGoogle).toHaveBeenCalledWith({ apiKey: key })
    const googleInstance = vi.mocked(createGoogle).mock.results[0]?.value
    expect(googleInstance).toHaveBeenCalledWith('gemini-3.5-flash-lite')
  })

  it('should instantiate the DeepSeek model with the correct name.', () => {
    const key = 'sk-0123456789abcdef0123456789abcdef'
    getModel(key)

    expect(createDeepSeek).toHaveBeenCalledWith({ apiKey: key })
    const deepseekInstance = vi.mocked(createDeepSeek).mock.results[0]?.value
    expect(deepseekInstance).toHaveBeenCalledWith('deepseek-v4-flash')
  })

  it('It must throw an error when the provider is not supported.', () => {
    const invalidKey = 'invalid-key'

    expect(() => getModel(invalidKey)).toThrow(
      'AI provider not supported or not detected: "unknown"'
    )
  })
})

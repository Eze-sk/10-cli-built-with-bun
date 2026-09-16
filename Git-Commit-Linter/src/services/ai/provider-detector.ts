import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogle } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'

type AIProvider = {
  provider: 'openai' | 'anthropic' | 'gemini' | 'deepseek' | 'unknown'
  error?: string
  apiKey: string
}

/**
 * Detects the AI provider based on the format of the given API key.
 *
 * @param {string} apiKey - The API key used to infer the AI provider.
 * @returns {AIProvider} An object containing the detected provider, the API key, and an optional error message if detection fails.
 */
export function providerDetector(apiKey: string): AIProvider {
  if (!apiKey) {
    return {
      provider: 'unknown',
      error: 'API key not provided',
      apiKey: ''
    }
  }

  if (/^sk-(proj-|admin-)/.test(apiKey)) {
    return { provider: 'openai', apiKey: apiKey }
  }

  if (/^sk-ant-/.test(apiKey)) {
    return { provider: 'anthropic', apiKey: apiKey }
  }

  if (/^AIzaSy/.test(apiKey) || /^AQ\./.test(apiKey)) {
    return { provider: 'gemini', apiKey: apiKey }
  }

  if (/^sk-[a-f0-9]{32}$/i.test(apiKey)) {
    return { provider: 'deepseek', apiKey: apiKey }
  }

  if (/^sk-[a-zA-Z0-9]{32,}/.test(apiKey)) {
    return { provider: 'openai', apiKey: apiKey }
  }

  return {
    provider: 'unknown',
    error: 'The API key was not recognized',
    apiKey: apiKey
  }
}

/**
 * Returns the appropriate AI model instance based on the detected provider from the given API key.
 *
 * @param {string} key - The API key used to detect the provider and instantiate the model.
 * @returns {ReturnType<typeof createOpenAI> | ReturnType<typeof createAnthropic> | ReturnType<typeof createGoogle> | ReturnType<typeof createDeepSeek>} The AI model instance for the detected provider.
 * @throws {Error} Throws an error if the AI provider is not supported or cannot be detected.
 */
export function getModel(key: string) {
  const { provider, apiKey } = providerDetector(key)

  switch (provider) {
    case 'openai': {
      const openai = createOpenAI({ apiKey })
      return openai('gpt-4o-mini')
    }
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey })
      return anthropic('claude-3-5-haiku-20241022')
    }
    case 'gemini': {
      const google = createGoogle({ apiKey })
      return google('gemini-3.5-flash-lite')
    }
    case 'deepseek': {
      const deepseek = createDeepSeek({ apiKey })
      return deepseek('deepseek-v4-flash')
    }
    default: {
      throw new Error(
        `AI provider not supported or not detected: "${provider}"`
      )
    }
  }
}

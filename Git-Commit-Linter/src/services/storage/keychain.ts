import keytar from 'keytar'
import z from 'zod'

import { apiKeyScheme } from '@/schemes'

import { IA_APIKEY, SERVICE_NAME } from '@constants/keytar'

interface TypeSetApiKey {
  error?: string
  key: string
}

/**
 * Validates and securely stores the AI API key in the system keychain.
 *
 * @param {string} key - The API key to validate and save.
 * @returns {Promise<TypeSetApiKey>} A promise that resolves to an object containing the saved key, or an error message if validation or storage fails.
 */
export async function SetApiKey(key: string): Promise<TypeSetApiKey> {
  try {
    const validateAPIKey = apiKeyScheme.parse(key)
    const cleanKey = validateAPIKey.trim()

    await keytar.setPassword(SERVICE_NAME, IA_APIKEY, cleanKey)

    return {
      key: validateAPIKey
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: err.issues[0]?.message,
        key: ''
      }
    }

    if (err instanceof Error) {
      return {
        error: err.message,
        key: ''
      }
    }

    return {
      error: String(err),
      key: ''
    }
  }
}

interface TypeGetApiKey {
  key: string | null
  error?: string
}

/**
 * Retrieves the stored AI API key from the system keychain.
 *
 * @returns {Promise<TypeGetApiKey>} A promise that resolves to an object containing the stored API key, or an error message if retrieval fails.
 */
export async function GetApiKey(): Promise<TypeGetApiKey> {
  try {
    const getApi = await keytar.getPassword(SERVICE_NAME, IA_APIKEY)
    return {
      key: getApi
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        key: '',
        error: err.message
      }
    }

    return {
      key: '',
      error: String(err)
    }
  }
}

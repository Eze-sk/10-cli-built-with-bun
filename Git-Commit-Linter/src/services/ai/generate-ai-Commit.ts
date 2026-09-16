import { generateText } from 'ai'

import { SYSTEM_PROMPT } from '@/constants/prompts'

import { getModel } from './provider-detector'

interface PropsAICommit {
  apiKey: string
  fileName: string
  diff: string
}

interface TypeAICommit {
  commit: string
  error?: string
}

/**
 * Generates an AI-powered commit message based on a git diff and file name.
 *
 * @param {PropsAICommit} options - The options for generating the commit.
 * @param {string} options.apiKey - The API key used to authenticate with the AI model provider.
 * @param {string} options.diff - The git diff content to analyze.
 * @param {string} options.fileName - The name of the file associated with the diff.
 * @returns {Promise<TypeAICommit>} A promise that resolves to an object containing the generated commit message, or an error message if the generation fails.
 */
export async function generateAICommit({
  apiKey,
  diff,
  fileName
}: PropsAICommit): Promise<TypeAICommit> {
  try {
    const { text } = await generateText({
      model: getModel(apiKey),
      system: SYSTEM_PROMPT,
      prompt: `<name_file>\n${fileName}\n</name_file> <git_diff>\n${diff}\n</git_diff>`
    })

    return {
      commit: text.trim()
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        commit: '',
        error: err.message
      }
    }

    return {
      commit: '',
      error: String(err)
    }
  }
}

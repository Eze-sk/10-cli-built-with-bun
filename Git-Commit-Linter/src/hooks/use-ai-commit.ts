import { useState } from 'react'

import { generateAICommit } from '@/services/ai/generate-ai-Commit'

import {
  useAPIKeyStore,
  useAlertStore,
  useCommitStore,
  useDiffStore
} from '../store'

/**
 * Generate an AI-crafted commit message for the currently selected file
 * and save it to the commit store.
 *
 * Reads the API key, current diff, and selected file from stores, invokes
 * the AI generator, and updates the commit store. Any errors are reported
 * through the alert store.
 *
 * @returns An object containing `handleRequest` to trigger generation and `loading`.
 */
export function useAICommit() {
  const [loading, setLoading] = useState(false)

  const apiKey = useAPIKeyStore((s) => s.key)
  const setMessage = useAlertStore((s) => s.setMessage)
  const setCommit = useCommitStore((s) => s.setCommit)
  const diff = useDiffStore((s) => s.diff)
  const files = useDiffStore((s) => s.files)
  const index = useDiffStore((s) => s.index)

  const handleRequest = async () => {
    try {
      setLoading(true)

      const currentFile = files[index]
      const fileName = currentFile?.name

      if (!fileName) return
      if (!apiKey)
        return setMessage({ message: 'API key not provided', type: 'error' })
      if (!diff)
        return setMessage({ message: 'diff not provided', type: 'error' })

      const { commit, error } = await generateAICommit({
        apiKey,
        fileName,
        diff
      })

      if (error) {
        return setMessage({ message: error, type: 'error' })
      }

      setCommit((prev) => {
        const filtered = prev.filter((item) => item.file !== fileName)
        return [...filtered, { file: fileName, commit: commit }]
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setMessage({ message: message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { handleRequest, loading }
}

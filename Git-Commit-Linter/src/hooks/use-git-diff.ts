import { useEffect } from 'react'

import { getChangedFiles } from '@/services/git/get-changed-files'
import { useAlertStore, useDiffStore } from '@/store'

import { getDiff } from '@services/git/diff'

/**
 * Hook to initialize and navigate changed files and their diffs from Git.
 *
 * On mount the hook loads changed files, sets the initial diff, and
 * exposes navigation handlers to move between files while fetching their
 * diffs. Errors are reported through the alert store.
 *
 * @returns The current file `index`, list of `files`, `loading` state, and navigation
 * functions `handleNextFile` and `handlePrevFile`.
 */
export function useGitDiff() {
  const setLoading = useDiffStore((s) => s.setLoading)
  const loading = useDiffStore((s) => s.loading)
  const index = useDiffStore((s) => s.index)
  const setIndex = useDiffStore((s) => s.setIndex)
  const files = useDiffStore((s) => s.files)
  const setFiles = useDiffStore((s) => s.setFiles)
  const setDiff = useDiffStore((s) => s.setDiff)
  const setMessage = useAlertStore((s) => s.setMessage)

  useEffect(() => {
    setLoading(true)

    const initializeFiles = async () => {
      const files = await getChangedFiles()

      const ChangedFilesError = files[0]?.error

      if (ChangedFilesError) {
        setMessage({ message: ChangedFilesError, type: 'error' })
      }

      setFiles(files)
      const firstFile = files[index]

      if (firstFile) {
        const { diff, error } = await getDiff(firstFile.fullPath)

        if (error) {
          setMessage({ message: error, type: 'error' })
        }

        setDiff(diff)
      }
    }

    initializeFiles()
    setLoading(false)
  }, [])

  const handleNextFile = async () => {
    setLoading(false)
    if (files.length === 0) return

    const nextIndex = Math.min(index + 1, files.length - 1)
    if (nextIndex === index) return
    setIndex(nextIndex)

    const file = files[nextIndex]

    if (file) {
      const { diff, error } = await getDiff(file.fullPath)

      if (error) {
        setMessage({ message: error, type: 'error' })
      }

      setDiff(diff)
    }

    setLoading(false)
  }

  const handlePrevFile = async () => {
    setLoading(true)
    if (files.length === 0) return

    const prevIndex = Math.max(index - 1, 0)
    if (prevIndex === index) return
    setIndex(prevIndex)

    const file = files[prevIndex]
    if (file) {
      const { diff, error } = await getDiff(file.fullPath)

      if (error) {
        setMessage({ message: error, type: 'error' })
      }

      setDiff(diff)
    }

    setLoading(false)
  }

  return {
    index,
    files,
    loading,
    handleNextFile,
    handlePrevFile
  }
}

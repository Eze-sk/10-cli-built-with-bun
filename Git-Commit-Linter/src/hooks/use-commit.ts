import z from 'zod'

import { useState } from 'react'

import { useApp } from 'ink'

import { commitScheme } from '@/schemes'
import { useAlertStore, useCommitStore, useDiffStore } from '@/store'

import { getDiff } from '@services/git/diff'

/**
 * Custom hook to commit the currently selected file using a validated
 * commit message.
 *
 * `handleCommit` validates the provided commit string, stages the current
 * file, runs `git commit`, updates internal stores (files, index, commits),
 * and fetches the next file's diff. On final file commit the app exits.
 *
 * @returns An object with `handleCommit` to perform the commit and `loading` state.
 */
export function useCommit() {
  const [loading, setLoading] = useState(false)
  const { exit } = useApp()

  const setMessage = useAlertStore((s) => s.setMessage)
  const index = useDiffStore((s) => s.index)
  const setIndex = useDiffStore((s) => s.setIndex)
  const files = useDiffStore((s) => s.files)
  const setFiles = useDiffStore((s) => s.setFiles)
  const setDiff = useDiffStore((s) => s.setDiff)
  const commit = useCommitStore((s) => s.commits)
  const setCommit = useCommitStore((s) => s.setCommit)

  const handleCommit = async ({ cmt }: { cmt: string }) => {
    try {
      setLoading(true)

      const currentFile = files[index]

      if (!currentFile?.fullPath) {
        setLoading(false)
        return setMessage({
          message: 'The file path was not found.',
          type: 'error'
        })
      }

      const verifiedCommit = commitScheme.parse(cmt)

      const addProc = Bun.spawn(['git', 'add', currentFile.fullPath], {
        stdout: 'ignore',
        stderr: 'ignore'
      })

      const addExitCode = await addProc.exited

      if (addExitCode === 0) {
        const commitProc = Bun.spawn(['git', 'commit', '-m', verifiedCommit], {
          stdout: 'ignore',
          stderr: 'ignore'
        })

        await commitProc.exited

        const newFiles = files.filter((_, i) => i !== index)
        const cleanCommit = commit.filter(
          (cmt) => cmt.file !== files[index]?.name
        )

        setCommit(cleanCommit)
        setFiles(newFiles)

        if (newFiles.length === 0) {
          setIndex(0)
          setDiff('')
          console.log('App exited')
          return exit()
        }

        const nextIndex = index >= newFiles.length ? newFiles.length - 1 : index
        setIndex(nextIndex)

        const file = newFiles[nextIndex]
        const result = await getDiff(file?.fullPath ?? '')

        if (result.error) {
          return setMessage({
            message: result.error,
            type: 'error'
          })
        }

        setDiff(result.diff)
        setLoading(false)

        return setMessage({
          message: '✅ Commit successful!',
          type: 'successful'
        })
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return setMessage({
          message: String(err.issues[0]?.message),
          type: 'error'
        })
      }

      return setMessage({ message: String(err), type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { handleCommit, loading }
}

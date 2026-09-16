import { resolve } from 'node:path'

import type { TypeFile } from '@/types'

interface TypeChangedFile extends TypeFile {
  error?: string
}

/**
 * Retrieves all modified or newly added files from the current git repository.
 *
 * @returns {Promise<TypeChangedFile[]>} A promise that resolves to an array of changed files with their names and full paths, or a single entry containing an error message if the operation fails.
 */
export async function getChangedFiles(): Promise<TypeChangedFile[]> {
  try {
    const procStatus = Bun.spawn([
      'git',
      'status',
      '--porcelain',
      '-z',
      '--untracked-files=all'
    ])

    const rawText = await new Response(procStatus.stdout).text()

    const clearStatus = rawText
      .split('\0')
      .filter((entry) => entry.trim().length > 0)
      .map((entry) => {
        return entry.slice(3).trim()
      })

    return clearStatus.map((value) => ({
      name: value,
      fullPath: resolve(value)
    }))
  } catch (err) {
    if (err instanceof Error) {
      return [
        {
          name: '',
          fullPath: '',
          error: err.message
        }
      ]
    }

    return [
      {
        name: '',
        fullPath: '',
        error: String(err)
      }
    ]
  }
}

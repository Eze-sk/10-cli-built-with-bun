interface TypeDiff {
  diff: string
  error?: string
}

/**
 * Retrieves the diff content of a file by running a git diff against it.
 *
 * @param {string} path - The path to the file to generate the diff for.
 * @returns {Promise<TypeDiff>} A promise that resolves to an object containing the diff content, or an error message if the operation fails.
 */
export async function getDiff(path: string): Promise<TypeDiff> {
  try {
    const proc = Bun.spawn([
      'git',
      'diff',
      '--no-index',
      '--color=never',
      '/dev/null',
      path
    ])

    const result = await new Response(proc.stdout).text()

    await proc.exited

    return {
      diff: result
        .split(/\r?\n/)
        .filter((line, index) => index >= 6 && line)
        .join('\n')
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        diff: '',
        error: err.message
      }
    }

    return {
      diff: '',
      error: String(err)
    }
  }
}

import { resolve } from 'node:path'

import { generateAICommit } from '@/services/ai/generate-ai-Commit'
import { getChangedFiles } from '@/services/git/get-changed-files'
import { wrapText } from '@/utils/wrap-text'

import { getDiff } from '@services/git/diff'
import { GetApiKey } from '@services/storage/keychain'

interface TypeHandleCommit {
  path: string | undefined
  flags: Record<string, unknown>
}

/**
 * CLI command handler to generate and apply AI-powered commits.
 *
 * Supports committing all changed files with `--all` or a single file
 * specified by `path`. Obtains the API key from storage, retrieves git
 * diffs, generates commit messages via the AI service, and runs git add
 * and commit for each file.
 *
 * @param {{ path: string | undefined, flags: Record<string, unknown> }}
 * Arguments object where `path` is an optional file path and `flags`
 * contains parsed CLI flags.
 */
export async function handleCommit({ path, flags }: TypeHandleCommit) {
  const { key, error } = await GetApiKey()

  if (error) {
    return console.error(error)
  }

  if (!key) {
    return console.error(
      'An API key is required; use the --set-key <key> flag to add your API key.'
    )
  }

  console.log(flags)

  if (flags.all) {
    const files = await getChangedFiles()

    if (files[0]?.error) {
      return console.error(error)
    }

    console.log('\n🤖 AI Commit Results\n')

    for (const [index, file] of files.entries()) {
      const { diff, error: diffError } = await getDiff(file.fullPath)

      if (diffError || !diff) {
        console.error(
          `  ${index + 1}. ❌ Error getting diff for ${file.name}:`,
          diffError
        )
        continue
      }

      const { commit, error: IAError } = await generateAICommit({
        apiKey: key,
        diff,
        fileName: file.name
      })

      if (IAError || !commit) {
        console.error(
          `  ${index + 1}. ❌ Error generating AI commit for ${file.name}:`,
          IAError
        )
        continue
      }

      await getAddCommit({ fullPath: file.fullPath, commit })

      console.log(`  ${index + 1}. 📄 ${file.name}\n`)
      console.log(`     ✍️ ${wrapText(commit)}\n`)
    }

    console.log(`✅ Total: ${files.length} file(s) committed\n`)
    return
  }

  if (path) {
    const formattedPath = path.replace(/\\+/g, '/').replace(/^\.\//, '')

    const fullPath = resolve(formattedPath)

    const files = await getChangedFiles()
    const diffExists = files.some((fl) => fl.name === formattedPath)

    if (!diffExists) {
      return console.error(
        `The ${formattedPath} file does not exist or has no changes.`
      )
    }

    const { diff, error: diffError } = await getDiff(path)

    if (diffError) {
      return console.error(error)
    }

    const { commit, error: IAError } = await generateAICommit({
      apiKey: key,
      diff,
      fileName: formattedPath
    })

    if (IAError) {
      return console.error(IAError)
    }

    await getAddCommit({ fullPath, commit })

    console.log('\n🤖 AI Commit Results\n')
    console.log(`  1. 📄 ${formattedPath}\n`)
    console.log(`     ✍️ ${wrapText(commit)}\n`)
    console.log(`✅ Total: 1 file(s) committed\n`)
    return
  }

  return console.error('Provide a valid path or use the --all flag.')
}

interface TypeGetAddCommit {
  fullPath: string
  commit: string
}

/**
 * Stages a file and creates a git commit with the provided message.
 *
 * @param {TypeGetAddCommit} options - The options for staging and committing.
 * @param {string} options.fullPath - The full path of the file to stage and commit.
 * @param {string} options.commit - The commit message to use.
 * @returns {Promise<void>} A promise that resolves when the file is staged and committed.
 * @throws {Error} Throws an error if the staging or commit process fails.
 */
async function getAddCommit({ fullPath, commit }: TypeGetAddCommit) {
  try {
    const addProc = Bun.spawn(['git', 'add', fullPath], {
      stdout: 'ignore',
      stderr: 'ignore'
    })

    const addExitCode = await addProc.exited

    if (addExitCode === 0) {
      const commitProc = Bun.spawn(['git', 'commit', '-m', commit], {
        stdout: 'ignore',
        stderr: 'ignore'
      })

      await commitProc.exited
    }
  } catch (err) {
    throw new Error('Error adding the commit', {
      cause: err
    })
  }
}

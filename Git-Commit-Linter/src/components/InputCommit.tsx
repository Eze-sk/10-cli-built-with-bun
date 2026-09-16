import { Box, useInput } from 'ink'

import { Spinner, TextInput } from '@inkjs/ui'

import { useCommitStore, useDiffStore } from '@/store'

import { COMMITS_VARIANTS } from '@constants/commit-types'

import { useAICommit } from '@hooks/use-ai-commit'
import { useCommit } from '@hooks/use-commit'

/**
 * An input component for entering or generating a commit message, with support
 * for AI-generated suggestions and commit submission.
 *
 * @returns The rendered commit input with loading spinners, suggestions, and AI generation shortcut.
 */
export default function InputCommit() {
  const { handleRequest, loading: isGenerating } = useAICommit()
  const { handleCommit, loading: isCommitting } = useCommit()
  const commitStore = useCommitStore((s) => s.commits)

  const index = useDiffStore((s) => s.index)
  const files = useDiffStore((s) => s.files)

  const currentFile = files[index]

  const currentCommit = commitStore.find(
    (cmt) => cmt.file === currentFile?.name
  )?.commit

  useInput((input, key) => {
    if (key.meta && input.toLowerCase() === 'g') {
      handleRequest()
    }
  })

  const formatCommit = currentCommit
    ? currentCommit.slice(0, Math.max(0, 215))
    : ' '

  return (
    <Box borderStyle="single" width="100%" flexDirection="column" height={4}>
      {isGenerating ? (
        <Spinner type="binary" label="Generating AI commit message..." />
      ) : isCommitting ? (
        <Spinner type="binary" label="processing commit..." />
      ) : (
        <TextInput
          key={`${currentFile?.name ?? 'file'}-${currentCommit ?? ''}`}
          suggestions={COMMITS_VARIANTS}
          placeholder="Enter commit message"
          defaultValue={formatCommit}
          onSubmit={(text) => handleCommit({ cmt: text })}
        />
      )}
    </Box>
  )
}

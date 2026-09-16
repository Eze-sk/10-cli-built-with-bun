import { useEffect, useState } from 'react'

import { Box, Text, useInput } from 'ink'

import { useAPIKeyStore, useAlertStore } from '@/store'

import ApiKeyForm from '@components/ApiKeyForm'
import CodeViewer from '@components/CodeViewer'
import Header from '@components/Header'
import InputCommit from '@components/InputCommit'
import Loading from '@components/Loading'

import { useGitDiff } from '@hooks/use-git-diff'

import { GetApiKey } from '@services/storage/keychain'

/**
 * The main TUI (Terminal User Interface) entry component that orchestrates the
 * API key setup, git diff navigation, code viewing, and commit input flow.
 *
 * @returns The rendered TUI layout with header, code viewer, commit input, and navigation hints.
 */
export default function TUI() {
  const [loadingAPIKey, setLoadingAPIKey] = useState(true)
  const setApiKey = useAPIKeyStore((s) => s.setKey)
  const apiKey = useAPIKeyStore((s) => s.key)
  const setMessage = useAlertStore((s) => s.setMessage)

  const {
    index,
    files,
    loading: loadingDiff,
    handleNextFile,
    handlePrevFile
  } = useGitDiff()

  useInput((_, key) => {
    if (key.meta && key.leftArrow) handlePrevFile()
    if (key.meta && key.rightArrow) handleNextFile()
  })

  useEffect(() => {
    async function getKey() {
      const { key, error } = await GetApiKey()

      if (!key && error) {
        return setMessage({ message: error, type: 'error' })
      }

      setApiKey(key)
      setLoadingAPIKey(false)
    }

    getKey()
  }, [])

  if (loadingAPIKey) <Loading />

  if (!apiKey) <ApiKeyForm />

  const isFirst = index === 0
  const isLast = index === files.length - 1 || files.length === 0

  return (
    <Box
      flexDirection="column"
      height="100%"
      justifyContent="space-between"
      paddingX={2}
    >
      <Header />
      <CodeViewer loading={loadingDiff} />
      <Box
        flexDirection="column"
        alignItems="center"
        width="100%"
        marginTop={1}
      >
        <InputCommit />
        <Box width="100%" justifyContent="space-between">
          <Box justifyContent="flex-start" width="33%">
            <Text color={isFirst ? 'gray' : 'white'}>🡸 prev [Alt + ←]</Text>
          </Box>
          <Box justifyContent="center" width="33%" gap={2}>
            <Text>accept ↵</Text>
            <Text color="blueBright">generate [Alt + g]</Text>
          </Box>
          <Box justifyContent="flex-end" width="33%">
            <Text color={isLast ? 'gray' : 'white'}>[Alt + →] next 🡺</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

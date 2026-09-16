import { useState } from 'react'

import { Box, Text } from 'ink'

import { TextInput } from '@inkjs/ui'

import { useAPIKeyStore } from '@/store'

import { SetApiKey } from '@services/storage/keychain'

/**
 * A form component that allows the user to enter and save their AI provider API key.
 *
 * @returns The rendered API key form with input, validation feedback, and error display.
 */
export default function ApiKeyForm() {
  const [error, setError] = useState<string | undefined>('')
  const setApiKey = useAPIKeyStore((s) => s.setKey)

  const handleSubmit = async (value: string) => {
    setError('')

    const response = await SetApiKey(value)
    if (response.error) return setError(response.error)

    setApiKey(response.key)
  }

  return (
    <Box
      width="100%"
      height={process.stdout.rows || 20}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Box
        flexDirection="column"
        gap={1}
        borderStyle="single"
        paddingX={2}
        paddingY={1}
        width="70%"
      >
        <Text color="blue" bold>
          Connect Your AI Provider
        </Text>
        <Box>
          <Text bold>Enter your API Key: </Text>
          <TextInput onSubmit={handleSubmit} placeholder="sk-..." />
        </Box>
      </Box>
      <Text color="red" bold>
        {error ? error : ' '}
      </Text>
    </Box>
  )
}

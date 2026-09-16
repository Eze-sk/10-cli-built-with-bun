import { useEffect } from 'react'

import { Box, Text } from 'ink'

import { useAlertStore, useDiffStore } from '@/store'

/**
 * A header component that displays the current file index, file name, alerts,
 * and navigation keyboard shortcuts.
 *
 * @returns The rendered header with file info, alert, and navigation hints.
 */
export default function Header() {
  const index = useDiffStore((s) => s.index)
  const files = useDiffStore((s) => s.files)

  return (
    <Box width="100%" display="flex" justifyContent="space-between">
      <Box gap={1}>
        <Text color="gray">
          {files && files.length}/{index + 1}
        </Text>
        <Text bold>{files && files[index]?.name}</Text>
      </Box>
      <Alert />
      <Box gap={1}>
        <Text color="gray">Navigation [Alt +</Text>
        <Text bold>🡱</Text>
        <Text bold>🡳</Text>
        <Text color="gray">]</Text>
      </Box>
    </Box>
  )
}

/**
 * An internal alert component that displays a truncated status message with
 * color-coded styling, auto-dismissing successful alerts after a short delay.
 *
 * @returns {JSX.Element} The rendered alert message.
 */
function Alert() {
  const message = useAlertStore((s) => s.message)
  const setMessage = useAlertStore((s) => s.setMessage)
  const msjType = useAlertStore((s) => s.type)

  const formatMessage = message
    ? message.slice(0, Math.max(0, 70 - 3)) + '...'
    : ' '

  const AlertColor = {
    error: 'red',
    successful: 'green'
  }

  useEffect(() => {
    if (msjType !== 'successful') return

    const timer = setTimeout(() => {
      setMessage({ message: '', type: undefined })
    }, 2000)

    return () => clearTimeout(timer)
  }, [message])

  return <Text color={msjType && AlertColor[msjType]}>{formatMessage}</Text>
}

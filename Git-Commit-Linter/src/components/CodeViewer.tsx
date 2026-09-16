import { useEffect, useState } from 'react'

import { Box, Text, useInput, useStdout } from 'ink'

import { Spinner } from '@inkjs/ui'

import { useDiffStore } from '@/store'

const OFFSET_HEIGHT = 8

const COLOR_BORDER = {
  '-': 'red',
  '+': 'green'
}

interface TypeCodeViewer {
  loading: boolean
}

/**
 * A component that displays and parses a git diff, rendering it with line numbers,
 * syntax-based coloring for added/removed lines, and keyboard navigation.
 *
 * @param props - The component props.
 * @param props.loading - Whether the diff content is still loading, showing a spinner when true.
 * @returns The rendered code viewer with scrollable, color-coded diff lines.
 */
export default function CodeViewer({ loading }: TypeCodeViewer) {
  const { stdout } = useStdout()
  const code = useDiffStore((s) => s.diff)

  const [startIndex, setStartIndex] = useState(0)
  const [maxViewCode, setMaxViewCode] = useState(() =>
    Math.max(1, (stdout.rows || 24) - OFFSET_HEIGHT)
  )

  useEffect(() => {
    function handleResize() {
      const newMaxView = Math.max(1, (stdout.rows || 24) - OFFSET_HEIGHT)
      setMaxViewCode(newMaxView)
    }
    stdout.on('resize', handleResize)
    return () => {
      stdout.off('resize', handleResize)
    }
  }, [stdout])

  const codeData = code.split(/\r?\n/).map((line) => line.replace(/\t/g, '  '))

  const visibleCode = codeData
    .slice(startIndex, startIndex + maxViewCode)
    .map((line, index) => ({
      lineNumber: startIndex + index + 1,
      line
    }))

  useInput((_, key) => {
    if (key.meta && key.downArrow) {
      const maxIndex = Math.max(0, codeData.length - maxViewCode)
      setStartIndex((prev) => Math.min(prev + 1, maxIndex))
    }

    if (key.meta && key.upArrow) {
      setStartIndex((prev) => Math.max(prev - 1, 0))
    }
  })

  return (
    <Box height={maxViewCode} marginTop={1} flexDirection="column">
      {loading ? (
        <Box
          width="100%"
          justifyContent="center"
          alignItems="center"
          marginTop={1}
          height={maxViewCode}
        >
          <Spinner label="loading code" type="binary" />
        </Box>
      ) : (
        <>
          {visibleCode.map((data) => {
            const formatNumber = data.lineNumber.toString().padStart(3, ' ')

            const getStaging = data.line.match(/[+-]/)?.[0] as
              keyof typeof COLOR_BORDER | undefined

            const content = getStaging ? data.line.slice(1) : data.line

            return (
              <Box key={data.lineNumber} gap={1}>
                <Text color={getStaging ? COLOR_BORDER[getStaging] : 'gray'}>
                  │
                </Text>
                <Text color="gray">{formatNumber}</Text>
                <Text wrap="truncate">
                  {content.length > 0 ? content : '\u00A0'}
                </Text>
              </Box>
            )
          })}
        </>
      )}
    </Box>
  )
}

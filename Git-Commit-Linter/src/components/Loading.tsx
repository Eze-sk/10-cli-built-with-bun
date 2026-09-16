import { Box } from 'ink'

import { Spinner } from '@inkjs/ui'

export default function Loading() {
  return (
    <Box
      width="100%"
      height={process.stdout.rows || 20}
      justifyContent="center"
      alignItems="center"
    >
      <Spinner label="Loading" type="binary" />
    </Box>
  )
}

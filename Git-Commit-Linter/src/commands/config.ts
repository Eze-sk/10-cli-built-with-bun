import { SetApiKey } from '@services/storage/keychain'

/**
 * CLI command to update configuration options.
 *
 * Currently supports setting the API key via the `--set-key` flag which
 * persists the provided key using the keychain storage service.
 *
 * @param {Record<string, unknown>} flags Parsed CLI flags.
 */
export async function handleConfig(flags: Record<string, unknown>) {
  if (flags.setKey) {
    await SetApiKey(flags.setKey as string)
    console.log('The API key has been successfully modified.')
  }
}

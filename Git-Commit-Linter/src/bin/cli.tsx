import meow from 'meow'

import TUI from '@components/TUI'
import { handleCommit } from '@/commands/commit'

import { handleConfig } from '@commands/config'

const cli = meow(
  `
  AI Commit CLI (cli-cmt-git) - Generate smart Git commit messages using AI.

  USAGE
    $ cli-cmt-git [command] [options]

  DESCRIPTION
    Running 'cli-cmt-git' without any subcommands will launch an interactive
    Terminal User Interface (TUI) to guide you through all options visually.

  COMMANDS
    (default)          Launch the interactive TUI.
    commit [file...]   Generate an AI commit message for staged changes or specific files.
    config             Manage configuration settings (API keys, models, etc.).
    help               Display help for cli-cmt-git.

  OPTIONS
    -v, --version      Show CLI version.
    -h, --help         Show help menu.

  CONFIG OPTIONS
    --set-key <key>    Set or update your AI service API key.

  COMMAND OPTIONS
    --all              Create an IA commit for all files.

  EXAMPLES
    1. Open the interactive UI:
      $ cli-cmt-git

    2. Set up your AI API Key:
      $ cli-cmt-git config --set-key "your-api-key-here"

    3. Generate a commit for all staged files:
      $ cli-cmt-git commit

    4. Generate a commit for a specific file:
      $ cli-cmt-git commit src/index.js

    5. Stage all changes and generate a commit message:
      $ cli-cmt-git commit --all
  `,
  {
    importMeta: import.meta,
    flags: {
      setKey: {
        type: 'string'
      },
      all: {
        type: 'boolean',
        default: false
      }
    }
  }
)

const command = cli.input[0]

switch (command) {
  case 'config': {
    handleConfig(cli.flags)
    break
  }

  case 'commit': {
    const [_, path] = cli.input
    handleCommit({ path, flags: cli.flags })
    break
  }

  case undefined: {
    const { render } = await import('ink')
    const { waitUntilExit } = render(<TUI />, { alternateScreen: true })
    await waitUntilExit()
    console.log('App exited!')
    break
  }

  default: {
    console.log(`Unknown command: ${command}`)
    cli.showHelp()
    break
  }
}

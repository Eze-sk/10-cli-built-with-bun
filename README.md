# 10 CLI Tools Built with Node.js

This repository is a collection of practical command-line applications built with Node.js to explore real-world developer workflows, automation, and terminal-first UX. Each project focuses on solving a specific problem in a compact, usable, and developer-friendly way.

## Project directory

| Tool / Name | Type | Description |
| --- | --- | --- |
| [Git-Commit-Linter](./Git-Commit-Linter) | TUI / command | AI-powered Git commit message generator that helps turn code changes into clear, meaningful commit summaries from either the terminal UI or shell commands. |

## Tool summaries

### [Git-Commit-Linter](./Git-Commit-Linter)

Git-Commit-Linter is a terminal-first AI assistant designed to generate smart Git commit messages based on the changes in your repository. It helps developers move faster by suggesting concise, relevant commit text instead of writing generic messages by hand.

How to use it:

1. Open the project folder:
   ```bash
   cd Git-Commit-Linter
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the interactive interface:
   ```bash
   bun run dev
   ```
   or run the CLI directly in command mode:
   ```bash
   cli-cmt-git commit --all
   ```
4. If needed, configure your AI provider key:
   ```bash
   cli-cmt-git config --set-key "your-api-key-here"
   ```

The project supports both a guided TUI flow and a faster command-line workflow, making it useful for quick generation as well as automation in a Git-based development process.

## Credits

Developed by [ezesk](https://github.com/Eze-sk)

This project is licensed under the MIT License.

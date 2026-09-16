# AI Commit CLI (cli-cmt-git)

This project is part of the group of 10 CLI tools built with Node.js, created to showcase practical command-line utilities in a modern developer workflow.

`cli-cmt-git` is a terminal-first AI assistant for generating smart Git commit messages based on the code changes in your repository. It helps you move faster without writing generic commit text by hand.

![mockups](./mockups.webp)

## Overview

This CLI gives you two ways to generate commit messages:

1. Interactive TUI mode
   - Launch the app without subcommands.
   - A simple, intuitive terminal interface guides you through the process.
   - Ideal for quick, visual usage and experimentation.

2. Command mode
   - Use the CLI directly from the shell.
   - Perfect for automation, scripting, and working inside Git workflows.

The app is built to support both human-friendly terminal flows and developer-friendly command-line usage.

## Features

- AI-generated Git commit messages from staged or selected files
- Simple interactive TUI experience
- Command-driven workflow for terminal users
- API key configuration for supported AI providers
- Support for generating commit suggestions for all files or a specific file
- Built for modern Node.js CLI development

## Usage

```bash
$ cli-cmt-git [command] [options]
```

### Default interactive mode

Running the CLI without any subcommand launches the TUI:

```bash
$ cli-cmt-git
```

This opens a guided Terminal User Interface that helps you configure options and generate the commit message visually.

### Commands

```bash
$ cli-cmt-git commit
$ cli-cmt-git commit --all
$ cli-cmt-git commit src/index.js
$ cli-cmt-git config --set-key "your-api-key-here"
```

### Help

```bash
$ cli-cmt-git --help
```

## Installation

This project uses Bun as the package manager and runtime for local development.

### Requirements

- Bun 1.3.5 or newer
- Node.js >= 18 (for compatibility with the project runtime environment)

### Install dependencies

```bash
bun install
```

### Start the CLI in dev mode

```bash
bun run dev
```

### Build the project

```bash
bun run build
```

### Lint and format

```bash
bun run lint
bun run format
```

## Bun usage rules

Use Bun for all project commands instead of npm, yarn, or pnpm.

Recommended workflow:

```bash
bun install
bun run dev
bun run build
bun run lint
```

This repo is configured with `packageManager: "bun@1.3.5"`, so the expected workflow is Bun-first. Avoid installing dependencies through other package managers unless explicitly required for a custom environment.

## Example usage flow

1. Install dependencies:

```bash
bun install
```

2. Set your API key:

```bash
cli-cmt-git config --set-key "your-api-key-here"
```

3. Run the interactive UI:

```bash
cli-cmt-git
```

4. Or generate a commit directly:

```bash
cli-cmt-git commit --all
```

## Project context

This is a simple but useful Git productivity tool in the spirit of the 10 CLI tools built with Node.js challenge. It focuses on an elegant developer experience with both a guided TUI and a faster command-line flow.

## Notes

- The default entrypoint opens the TUI when no command is provided.
- `commit` can operate on staged changes or a specific file path.
- `config` is used to manage AI service credentials and related settings.
- This project is still best used as a local developer utility for generating commit message suggestions.

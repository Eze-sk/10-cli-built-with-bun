export const TYPE_COMMITS = [
  'fix',
  'feat',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert'
]

export const COMMITS_VARIANTS = TYPE_COMMITS.flatMap((type) => [
  `${type}: `,
  `${type}!: `,
  `${type}(): `,
  `${type}()!: `,
  `${type}(scope): `,
  `${type}(scope)!: `,
  `${type}(scope)!: BREAKING CHANGE:`,
  `${type}()!: BREAKING CHANGE:`,
  `${type}(): BREAKING CHANGE:`,
  `${type}: BREAKING CHANGE:`
])

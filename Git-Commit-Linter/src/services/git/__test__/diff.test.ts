import { getDiff } from '../diff'

type BunMock = {
  spawn: ReturnType<typeof vi.fn>
}

beforeAll(() => {
  Object.assign(globalThis, {
    Bun: { spawn: vi.fn() } satisfies BunMock
  })
})

describe('getDiff', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should run the git command and process the difference, ignoring the first 6 lines.', async () => {
    const mockGitOutput = [
      'diff --git a/dev/null b/file.txt',
      'new file mode 100644',
      'index 0000000..1234567',
      '--- /dev/null',
      '+++ b/file.txt',
      '@@ -0,0 +1,2 @@',
      '+ first line added',
      '',
      '+ second line added'
    ].join('\n')

    const spawnSpy = vi.spyOn(Bun, 'spawn').mockReturnValue({
      stdout: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(mockGitOutput))
          controller.close()
        }
      })
    } as ReturnType<typeof Bun.spawn>)
    const result = await getDiff('file.txt')

    expect(spawnSpy).toHaveBeenCalledWith([
      'git',
      'diff',
      '--no-index',
      '--color=never',
      '/dev/null',
      'file.txt'
    ])

    expect(result).toEqual({
      diff: '+ first line added\n+ second line added'
    })
  })

  it('It must catch `Error` instances when `Bun.spawn` fails.', async () => {
    vi.spyOn(Bun, 'spawn').mockImplementationOnce(() => {
      throw new Error('Git command not found')
    })

    const result = await getDiff('file.txt')

    expect(result).toEqual({
      diff: '',
      error: 'Git command not found'
    })
  })

  it('must handle errors that are not instances of Error.', async () => {
    vi.spyOn(Bun, 'spawn').mockImplementationOnce(() => {
      throw 'Unexpected system error'
    })

    const result = await getDiff('file.txt')

    expect(result).toEqual({
      diff: '',
      error: 'Unexpected system error'
    })
  })
})

import {getChangedFiles} from "../get-changed-files"

type BunMock = {
  spawn: ReturnType<typeof vi.fn>
}

beforeAll(() => {
  Object.assign(globalThis, {
    Bun: { spawn: vi.fn() } satisfies BunMock
  })
})

describe('getChangedFiles', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should return the list of modified files correctly.', async () => {
    const mockOutput = ' M file1.ts\0?? file2.ts\0'

    vi.spyOn(Bun, 'spawn').mockReturnValue({
      stdout: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(mockOutput))
          controller.close()
        }
      })
    } as ReturnType<typeof Bun.spawn>)

    const result = await getChangedFiles()

    expect(Bun.spawn).toHaveBeenCalledWith([
      'git',
      'status',
      '--porcelain',
      '-z',
      '--untracked-files=all'
    ])

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ name: 'file1.ts' })
    expect(result[1]).toMatchObject({ name: 'file2.ts' })
    expect(result[0]?.fullPath).toContain('file1.ts')
  })

  it('should return an object with error if Bun.spawn fails.', async () => {
    vi.spyOn(Bun, 'spawn').mockImplementation(() => {
      throw new Error('Git command failed')
    })

    const result = await getChangedFiles()

    expect(result).toEqual([
      {
        name: '',
        fullPath: '',
        error: 'Git command failed'
      }
    ])
  })
})

import { generateText } from 'ai'

import { generateAICommit } from '../generate-ai-Commit'

vi.mock('ai', () => ({
  generateText: vi.fn()
}))

vi.mock('../provider-detector', () => ({
  getModel: vi.fn().mockReturnValue('mocked-model')
}))

const mockedGenerateText = vi.mocked(generateText)

describe('generateAICommit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('it must return the correctly formatted commit when the API responds successfully.', async () => {
    mockedGenerateText.mockResolvedValueOnce({
      text: '  feat: add unit test  '
    } as Awaited<ReturnType<typeof generateText>>)

    const result = await generateAICommit({
      apiKey: 'test-key',
      diff: '+ test',
      fileName: 'index.ts'
    })

    expect(result).toEqual({ commit: 'feat: add unit test' })

    expect(generateText).toHaveBeenCalledWith({
      model: 'mocked-model',
      system: expect.any(String),
      prompt:
        '<name_file>\nindex.ts\n</name_file> <git_diff>\n+ test\n</git_diff>'
    })
  })

  it('must handle errors of type Error correctly.', async () => {
    vi.mocked(generateText).mockRejectedValueOnce(new Error('API Key inválida'))

    const result = await generateAICommit({
      apiKey: 'bad-key',
      diff: '',
      fileName: ''
    })

    expect(result).toEqual({
      commit: '',
      error: 'API Key inválida'
    })
  })

  it('must handle errors that are not instances of Error.', async () => {
    vi.mocked(generateText).mockRejectedValueOnce('Unknown error in string')

    const result = await generateAICommit({
      apiKey: 'key',
      diff: '',
      fileName: ''
    })

    expect(result).toEqual({
      commit: '',
      error: 'Unknown error in string'
    })
  })
})

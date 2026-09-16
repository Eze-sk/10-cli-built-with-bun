import { wrapText } from '../wrap-text'

describe('wrapText', () => {
  const originalColumns = process.stdout.columns

  beforeEach(() => {
    Object.defineProperty(process.stdout, 'columns', {
      value: 80,
      writable: true,
      configurable: true
    })
  })

  afterEach(() => {
    Object.defineProperty(process.stdout, 'columns', {
      value: originalColumns,
      writable: true,
      configurable: true
    })
  })

  it('should keep the short lines unchanged', () => {
    const input = 'Texto corto'
    const result = wrapText(input, 8)

    expect(result).toBe('Texto corto')
  })

  it('should wrap long text respecting the maximum line width', () => {
    const longText = 'This is a fairly long line that should definitely be split into multiple lines because it exceeds the allowed limit.'
    const result = wrapText(longText, 8)

    const lines = result.split('\n ')
    expect(lines.length).toBeGreaterThan(1)

    lines.forEach((line) => {
      expect(line.trim().length).toBeLessThanOrEqual(72)
    })
  })

  it('should apply the correct indent between line breaks', () => {
    const input = 'Very long first line that requires a line jump\nShort second line'
    const indentSpaces = 4

    const result = wrapText(input, indentSpaces)
    const indent = ' '.repeat(indentSpaces)

    expect(result).toContain(`\n${indent}`)
  })

  it('should use a minimum width of 20 characters even if the terminal columns are very small.', () => {
    Object.defineProperty(process.stdout, 'columns', { value: 10 })

    const text = 'Words that need to be divided'
    const result = wrapText(text, 5)

    const lines = result.split('\n')
    expect(lines[0]?.trim().length).toBeLessThanOrEqual(20)
  })

  it('should use the default value 80 if process.stdout.columns is undefined', () => {
    Object.defineProperty(process.stdout, 'columns', { value: undefined })

    const text = 'Text to test non-interactive terminal fallback'
    const result = wrapText(text, 8)

    expect(result).toBe(text)
  })
})

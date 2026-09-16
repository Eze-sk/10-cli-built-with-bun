/**
 * Wraps text to fit within the terminal width, applying a given indentation to wrapped lines.
 *
 * @param text - The text to wrap.
 * @param indentSpaces - The number of spaces used for indentation on wrapped lines.
 * @returns The wrapped text with the specified indentation applied to each new line.
 */
export function wrapText(text: string, indentSpaces: number = 8) {
  const columns = process.stdout.columns || 80
  const maxLineWidth = Math.max(columns - indentSpaces, 20)
  const indent = ' '.repeat(indentSpaces)

  const lines = text.split('\n')
  const wrappedLines: string[] = []

  for (const line of lines) {
    if (line.length <= maxLineWidth) {
      wrappedLines.push(line)
      continue
    }

    const words = line.split(' ')
    let currentLine = ''

    for (const word of words) {
      if (
        (currentLine + (currentLine ? ' ' : '') + word).length <= maxLineWidth
      ) {
        currentLine += (currentLine ? ' ' : '') + word
      } else {
        wrappedLines.push(currentLine)
        currentLine = word
      }
    }
    if (currentLine) wrappedLines.push(currentLine)
  }

  return wrappedLines.join(`\n${indent}`)
}

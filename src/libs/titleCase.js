export function titleCase(text) {
  if (text) {
    return text[0].toUpperCase() + text.slice(1, text.length)
  }
  return ''
}

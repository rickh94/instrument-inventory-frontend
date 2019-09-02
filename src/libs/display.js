export function stars(count) {
  return '★'.repeat(count)
}
export const yesOrNo = value => (value ? 'Yes' : 'No')

export const truncateText = (text, limit) => {
  if (!text) {
    return ''
  }
  if (text.length <= limit) {
    return text
  }
  const cut = text.substring(0, limit)
  return cut + '...'
}

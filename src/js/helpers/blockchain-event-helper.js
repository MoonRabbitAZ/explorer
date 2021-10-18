export function formatMetaPartsToString (meta) {
  if (!meta) return null
  if (!meta.documentation.length) return ''

  const strings = meta.documentation.map((doc) => doc.toString().trim())
  const firstEmpty = strings.findIndex((doc) => !doc.length)
  const combined = (
    firstEmpty === -1
      ? strings
      : strings.slice(0, firstEmpty)
  ).join(' ').replace(/#(<weight>| <weight>).*<\/weight>/, '')
  const parts = combined.replace(/[\\`]/g, '')

  return parts
}

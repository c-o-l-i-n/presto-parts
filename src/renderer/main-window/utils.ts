export const resolveFieldName = (label: string): string =>
  label
    .replace(/[^a-z0-9 ]/gi, '')
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')

export const noop = (): void => {}

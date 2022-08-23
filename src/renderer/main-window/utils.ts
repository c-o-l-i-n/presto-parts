export const resolveFieldName = (label: string) =>
	label
		.replace(/[^a-z0-9 ]/gi, '')
		.toLowerCase()
		.trim()
		.replace(/ /g, '-')

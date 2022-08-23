import { resolveFieldName } from '../renderer/main-window/utils'

describe('resolveFieldName', () => {
	const expectedResult: Record<string, string> = {
		'Song Title': 'song-title',
		'PDF Source': 'pdf-source',
		'Parts List': 'parts-list',
		'Collection Name': 'collection-name',
		'Song Folders Location': 'song-folders-location',
		'Song List': 'song-list',
		'Instrument Parts List': 'instrument-parts-list',
		'C O L I N': 'c-o-l-i-n',
		'Presto Parts!@#$%^&*()': 'presto-parts',
		'[square brackets]': 'square-brackets',
		'I love to play the Trumpet 🎺': 'i-love-to-play-the-trumpet',
		abc123: 'abc123',
		'DEF 456': 'def-456',
		'14161     h-row': '14161-----hrow',
		'there are spaces at the end         ': 'there-are-spaces-at-the-end',
		'       there are spaces at the start': 'there-are-spaces-at-the-start',
		"    I'm surrounded by spaces! 😧    ": 'im-surrounded-by-spaces',
		'': '',
		'   ': '',
		'🌮': '',
	}

	Object.keys(expectedResult).forEach((input) => {
		it(`should return "${expectedResult[input]}" when given "${input}"`, () =>
			expect(resolveFieldName(input)).toEqual(expectedResult[input]))
	})
})

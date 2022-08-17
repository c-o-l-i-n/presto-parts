type Maybe<T> = T | undefined

enum Page {
	SEPARATE,
	GENERATE,
}

interface ActivePageContextType {
	activePage: Page
	setActivePage?: (page: Page) => void
}

interface Tab {
	text: string
	icon: string
	page: Page
}

type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning'

enum IpcMainMessage {
	STORE_GET = 'store-get',
	STORE_SET = 'store-set',
	SHOW_MESSAGE_BOX = 'show-message-box',
	CHOOSE_PDF_SOURCE_FILE = 'choose-pdf-source-file',
	CHOOSE_SONG_FOLDERS_LOCATION = 'choose-song-folders-location',
	SEPARATE = 'separate',
	GENERATE = 'generate',
}

enum IpcRendererMessage {
	USER_CHOSE_PDF_SOURCE_FILE = 'user-chose-pdf-source-file',
	USER_CHOSE_SONG_FOLDERS_LOCATION = 'user-chose-song-folders-location',
	SHOW_LOADER = 'show-loader',
	HIDE_LOADER = 'hide-loader',
}

export {
	Maybe,
	Page,
	ActivePageContextType,
	Tab,
	MessageBoxType,
	IpcMainMessage,
	IpcRendererMessage,
}

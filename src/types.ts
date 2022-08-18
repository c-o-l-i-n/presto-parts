export type Maybe<T> = T | undefined

export enum Page {
	SEPARATE,
	GENERATE,
}

export interface Context<T> {
	state: T
	setState?: (newState: T) => void
}

export interface Tab {
	text: string
	icon: string
	page: Page
}

export type MessageBoxType = 'none' | 'info' | 'error' | 'question' | 'warning'

export enum IpcMainMessage {
	STORE_GET = 'store-get',
	STORE_SET = 'store-set',
	SHOW_MESSAGE_BOX = 'show-message-box',
	CHOOSE_PDF_SOURCE_FILE = 'choose-pdf-source-file',
	CHOOSE_SONG_FOLDERS_LOCATION = 'choose-song-folders-location',
	SEPARATE = 'separate',
	GENERATE = 'generate',
}

export interface IpcRendererApi {
	invoke: (
		channel: IpcMainMessage,
		payload?: Payload
	) => Promise<Maybe<string[]>>
}

export interface ElectronApi {
	ipcRenderer: IpcRendererApi
}

export interface SepatatePayload {
	songTitle: string
	pdfSourcePath: string
	partsList: string
}

export interface GeneratePayload {
	collectionName: string
	songFoldersLocation: string
	songList: string
	instrumentPartsList: string
}

export type Payload = SepatatePayload | GeneratePayload

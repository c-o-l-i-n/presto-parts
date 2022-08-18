export type Maybe<T> = T | undefined

export interface AppInfo {
	name: string
	version: string
}

export enum ExternalSite {
	APP_WEBSITE = 'https://prestoparts.org',
	ICONS_8 = 'https://icons8.com',
}

export interface ErrorReport {
	os: NodeJS.Platform
	osVersion: string
	appVersion: string
	electronVersion: string
	nodeVersion: string
	chromeVersion: string
	stackTrace: string
}

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
	GET_APP_INFO = 'get-app-info',
	OPEN_EXTERNAL = 'open-external',
}

export interface ElectronApi {
	invoke: (channel: IpcMainMessage, payload?: Payload) => Promise<Maybe<string>>
	getAppInfo: () => Promise<AppInfo>
	openExternal: (url: ExternalSite) => void
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

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
	SEPARATE = 'Separate Song Parts',
	GENERATE = 'Generate Instrument Parts and Master',
}

export interface Context<T> {
	state: T
	setState?: (newState: T) => void
}

export interface Tab {
	icon: string
	page: Page
}

export enum MessageBoxType {
	NONE = 'none',
	INFO = 'info',
	ERROR = 'error',
	QUESTION = 'question',
	WARNING = 'warning',
}

export enum FileType {
	PDF = 'PDF',
	FOLDER = 'folder',
	NO_TYPE = 'file with no type',
}

export enum IpcMainMessage {
	GET_APP_DATA = 'get-app-data',
	STORE_SET = 'store-set',
	SHOW_MESSAGE_BOX = 'show-message-box',
	FILE_IS_DIRECTORY = 'file-is-directory',
	GET_FILE_EXTENSION = 'get-file-extension',
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
	showMessageBox: (type: MessageBoxType, text: string) => void
	fileIsDirectory: (filePath: string) => Promise<boolean>
	getFileExtension: (filePath: string) => Promise<string>
	getAppData: () => Promise<AppData>
	saveToStore: (payload: Payload) => void
}

export type SeparatePayload = {
	songTitle: string
	pdfSourcePath: string
	partsList: string
}

export type GeneratePayload = {
	collectionName: string
	songFoldersLocation: string
	songList: string
	instrumentPartsList: string
}

export type Payload = SeparatePayload | GeneratePayload

export type AppData = SeparatePayload & GeneratePayload

import { contextBridge, ipcRenderer } from 'electron'
import {
	AppData,
	AppInfo,
	ElectronApi,
	ExternalSite,
	GeneratePayload,
	IpcMainMessage,
	Maybe,
	MessageBoxType,
	Page,
	Payload,
	SeparatePayload,
} from '../../types/types'

export const electronApi: ElectronApi = {
	async invoke(
		channel: IpcMainMessage,
		payload?: Payload
	): Promise<Maybe<string>> {
		const value: Maybe<string[]> = await ipcRenderer.invoke(channel, payload)
		if (!value) {
			return undefined
		}
		return value[0]
	},
	getAppInfo(): Promise<AppInfo> {
		return ipcRenderer.invoke(IpcMainMessage.GET_APP_INFO)
	},
	openExternal(url: ExternalSite) {
		ipcRenderer.send(IpcMainMessage.OPEN_EXTERNAL, url)
	},
	showMessageBox(type: MessageBoxType, text: string) {
		ipcRenderer.send(IpcMainMessage.SHOW_MESSAGE_BOX, type, text)
	},
	fileIsDirectory(filePath: string): Promise<boolean> {
		return ipcRenderer.invoke(IpcMainMessage.FILE_IS_DIRECTORY, filePath)
	},
	getFileExtension(filePath: string): Promise<string> {
		return ipcRenderer.invoke(IpcMainMessage.GET_FILE_EXTENSION, filePath)
	},
	getAppData(): Promise<AppData> {
		return ipcRenderer.invoke(IpcMainMessage.GET_APP_DATA)
	},
	saveToStore(payload: Payload) {
		ipcRenderer.send(IpcMainMessage.STORE_SET, payload)
	},
}

contextBridge?.exposeInMainWorld('electron', electronApi)

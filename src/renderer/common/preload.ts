import { contextBridge, ipcRenderer } from 'electron'
import {
	AppInfo,
	ElectronApi,
	ExternalSite,
	IpcMainMessage,
	Maybe,
	MessageBoxType,
	Payload,
} from '../../types/types'

const electronApi: ElectronApi = {
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
}

contextBridge.exposeInMainWorld('electron', electronApi)

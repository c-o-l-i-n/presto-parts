import { contextBridge, ipcRenderer } from 'electron'
import {
	AppInfo,
	ElectronApi,
	ExternalSite,
	IpcMainMessage,
	Maybe,
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
}

contextBridge.exposeInMainWorld('electron', electronApi)

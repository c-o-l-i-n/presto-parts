import { contextBridge, ipcRenderer } from 'electron'
import { IpcMainMessage, IpcRendererApi, Maybe, Payload } from '../types'

const ipcRendererApi: IpcRendererApi = {
	invoke(channel: IpcMainMessage, payload?: Payload): Promise<Maybe<string[]>> {
		return ipcRenderer.invoke(channel, payload)
	},
}

contextBridge.exposeInMainWorld('electron', { ipcRenderer: ipcRendererApi })

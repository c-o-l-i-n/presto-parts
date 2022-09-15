import { contextBridge, ipcRenderer } from 'electron'
import { AppData, AppInfo, ElectronApi, ExternalSite, IpcMainMessage, Maybe, MessageBoxType, Payload } from '../../types/types'

export const electronApi: ElectronApi = {
  async invoke (
    channel: IpcMainMessage,
    payload?: Payload
  ): Promise<Maybe<string>> {
    const value: Maybe<string[]> = await ipcRenderer.invoke(channel, payload)
    if (value == null) {
      return undefined
    }
    return value[0]
  },
  async getAppInfo (): Promise<AppInfo> {
    return await ipcRenderer.invoke(IpcMainMessage.GET_APP_INFO)
  },
  openExternal (url: ExternalSite) {
    ipcRenderer.send(IpcMainMessage.OPEN_EXTERNAL, url)
  },
  showMessageBox (type: MessageBoxType, text: string) {
    ipcRenderer.send(IpcMainMessage.SHOW_MESSAGE_BOX, type, text)
  },
  async fileIsDirectory (filePath: string): Promise<boolean> {
    return await ipcRenderer.invoke(IpcMainMessage.FILE_IS_DIRECTORY, filePath)
  },
  async getFileExtension (filePath: string): Promise<string> {
    return await ipcRenderer.invoke(IpcMainMessage.GET_FILE_EXTENSION, filePath)
  },
  async getAppData (): Promise<AppData> {
    return await ipcRenderer.invoke(IpcMainMessage.GET_APP_DATA)
  },
  saveToStore (payload: Payload) {
    ipcRenderer.send(IpcMainMessage.STORE_SET, payload)
  }
}

contextBridge?.exposeInMainWorld('electron', electronApi)

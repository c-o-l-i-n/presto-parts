import Store from 'electron-store'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import separateSongParts from './separate-song-parts'
import generateInstrumentPartsAndMaster from './generate-instrument-parts-and-master'
import {
	GeneratePayload,
	IpcMainMessage,
	MessageBoxType,
	SepatatePayload,
} from '../types'

const setupIpcMain = (mainWindow: BrowserWindow) => {
	const showMessageBox = (type: MessageBoxType, message: string) => {
		dialog.showMessageBox(mainWindow, {
			type: type,
			message: message,
			title: app.name,
		})
	}

	const store = new Store()

	ipcMain.handle(IpcMainMessage.STORE_GET, (e, storeItem) => {
		return store.get(storeItem)
	})

	ipcMain.on(IpcMainMessage.STORE_SET, (e, storeItem, value) => {
		store.set(storeItem, value)
	})

	ipcMain.on(IpcMainMessage.SHOW_MESSAGE_BOX, (e, type, message) => {
		showMessageBox(type, message)
	})

	ipcMain.handle(IpcMainMessage.CHOOSE_PDF_SOURCE_FILE, () => {
		return dialog.showOpenDialogSync(mainWindow, {
			title: 'Choose PDF source file',
			message: 'Choose PDF source file',
			filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
			properties: ['openFile'],
		})
	})

	ipcMain.handle(IpcMainMessage.CHOOSE_SONG_FOLDERS_LOCATION, () => {
		return dialog.showOpenDialogSync(mainWindow, {
			title: 'Choose song folders location',
			message: 'Choose song folders location',
			properties: ['openDirectory'],
		})
	})

	ipcMain.handle(
		IpcMainMessage.SEPARATE,
		async (e, payload: SepatatePayload) => {
			try {
				const destinationDirectory = await separateSongParts(payload)
				showMessageBox(
					'info',
					`Success!\n\nSeparated PDFs created in folder "${destinationDirectory}"`
				)
			} catch (errorMessage) {
				showMessageBox('error', errorMessage.toString())
			}
		}
	)

	ipcMain.handle(
		IpcMainMessage.GENERATE,
		async (e, payload: GeneratePayload) => {
			try {
				const destinationDirectory = await generateInstrumentPartsAndMaster(
					payload
				)
				showMessageBox(
					'info',
					`Success!\n\nInstrument parts and Master PDF created in folder "${destinationDirectory}"`
				)
			} catch (errorMessage) {
				showMessageBox('error', errorMessage.toString())
			}
		}
	)
}

export default setupIpcMain

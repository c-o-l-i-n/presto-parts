import Store from 'electron-store'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import separateSongParts from './separate-song-parts'
import generateInstrumentPartsAndMaster from './generate-instrument-parts-and-master'
import { IpcMainMessage, IpcRendererMessage, MessageBoxType } from '../types'

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

	ipcMain.on(IpcMainMessage.CHOOSE_PDF_SOURCE_FILE, () => {
		mainWindow.webContents.send(
			IpcRendererMessage.USER_CHOSE_PDF_SOURCE_FILE,
			dialog.showOpenDialogSync(mainWindow, {
				title: 'Choose PDF source file',
				message: 'Choose PDF source file',
				filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
				properties: ['openFile'],
			})
		)
	})

	ipcMain.on(IpcMainMessage.CHOOSE_SONG_FOLDERS_LOCATION, () => {
		mainWindow.webContents.send(
			IpcRendererMessage.USER_CHOSE_SONG_FOLDERS_LOCATION,
			dialog.showOpenDialogSync(mainWindow, {
				title: 'Choose song folders location',
				message: 'Choose song folders location',
				properties: ['openDirectory'],
			})
		)
	})

	ipcMain.on(
		IpcMainMessage.SEPARATE,
		async (e, sourcePath, partsList, prefix) => {
			mainWindow.webContents.send(IpcRendererMessage.SHOW_LOADER)
			try {
				const destinationDirectory = await separateSongParts(
					sourcePath,
					partsList,
					prefix
				)
				showMessageBox(
					'info',
					`Success!\n\nSeparated PDFs created in folder "${destinationDirectory}"`
				)
			} catch (errorMessage) {
				showMessageBox('error', errorMessage.toString())
			}
			mainWindow.webContents.send(IpcRendererMessage.HIDE_LOADER)
		}
	)

	ipcMain.on(
		IpcMainMessage.GENERATE,
		async (e, pieceList, songFoldersLocation, partsList, destName) => {
			mainWindow.webContents.send(IpcRendererMessage.SHOW_LOADER)
			try {
				const destinationDirectory = await generateInstrumentPartsAndMaster(
					pieceList,
					songFoldersLocation,
					partsList,
					destName
				)
				showMessageBox(
					'info',
					`Success!\n\nInstrument parts and Master PDF created in folder "${destinationDirectory}"`
				)
			} catch (errorMessage) {
				showMessageBox('error', errorMessage.toString())
			}
			mainWindow.webContents.send(IpcRendererMessage.HIDE_LOADER)
		}
	)
}

export default setupIpcMain

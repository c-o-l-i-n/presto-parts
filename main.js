const { app, dialog, BrowserWindow, ipcMain } = require('electron')
const { separateSongParts } = require('./js-backend/separateSongParts')
const {
	generateInstrumentPartsAndMaster,
} = require('./js-backend/generateInstrumentPartsAndMaster')

let backend
let mainWindow

const showMessageBox = (type, message) => {
	dialog.showMessageBox(mainWindow, { type: type, message: message })
}

const startBackend = (window, debugMode) => {
	if (debugMode) {
		// requires Python virtual environment called "env"
		backend = require('child_process').execFile('./backend/env/bin/python', [
			'./backend/backend.py',
		])
		backend.stdout.on('data', (data) => {
			console.log('backend: ', data.toString('utf-8'))
		})
		backend.stderr.on('data', (data) => {
			console.log(`backend error: ${data.toString('utf-8')}`)
			// get the last line of the Python traceback after ': '
			const errorMessage = data.toString('utf-8').match(/(?<=: )(.*)\n$/gm)[0]
			showMessageBox('error', errorMessage)
		})
	} else {
		backend = require('child_process').exec('./backend/dist/backend')
		backend.stderr.on('data', (data) => {
			// get the last line of the Python traceback after ': '
			const errorMessage = data.toString('utf-8').match(/(?<=: )(.*)\n$/)[0]
			showMessageBox('error', errorMessage)
		})
	}
}

const terminateBackend = () => {
	backend.kill()
}

createWindow = () => {
	const win = new BrowserWindow({
		width: 770,
		minWidth: 770,
		height: 660,
		minHeight: 660,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	win.loadFile('frontend/separate.html')

	mainWindow = win
}

app.whenReady().then(() => {
	createWindow()
	startBackend(mainWindow, (debugMode = false))
})

app.on('before-quit', terminateBackend)

ipcMain.on('show-message-box', (e, type, message) => {
	showMessageBox(type, message)
})

ipcMain.on('separate', async (e, sourcePath, partsList, prefix) => {
	mainWindow.webContents.send('show-loader')
	try {
		const destinationDirectory = await separateSongParts(
			sourcePath,
			partsList,
			prefix
		)
		showMessageBox(
			'info',
			`Success!\n\nSeparated PDFs created in '${destinationDirectory}'`
		)
	} catch (errorMessage) {
		showMessageBox('error', errorMessage.toString())
	}
	mainWindow.webContents.send('hide-loader')
})

ipcMain.on(
	'generate',
	async (e, pieceList, songFoldersLocation, partsList, destName) => {
		mainWindow.webContents.send('show-loader')
		try {
			const destinationDirectory = await generateInstrumentPartsAndMaster(
				pieceList,
				songFoldersLocation,
				partsList,
				destName
			)
			showMessageBox(
				'info',
				`Success!\n\nInstrument parts and Master PDF created in '${destinationDirectory}'`
			)
		} catch (errorMessage) {
			showMessageBox('error', errorMessage.toString())
		}
		mainWindow.webContents.send('hide-loader')
	}
)

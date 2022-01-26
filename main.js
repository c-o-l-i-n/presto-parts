const { app, dialog, BrowserWindow, ipcMain, Menu, shell } = require('electron')
const { separateSongParts } = require('./backend/separateSongParts')
const {
	generateInstrumentPartsAndMaster,
} = require('./backend/generateInstrumentPartsAndMaster')

let mainWindow

const showMessageBox = (type, message) => {
	dialog.showMessageBox(mainWindow, { type: type, message: message })
}

createWindow = () => {
	const win = new BrowserWindow({
		show: false,
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

	win.once('ready-to-show', () => {
		win.show()
	})

	mainWindow = win
}

app.whenReady().then(() => {
	createWindow()
})

ipcMain.on('show-message-box', (e, type, message) => {
	showMessageBox(type, message)
})

ipcMain.on('choose-pdf-source-file', () => {
	mainWindow.webContents.send(
		'user-chose-pdf-source-file',
		dialog.showOpenDialogSync(mainWindow, {
			title: 'Choose PDF source file',
			message: 'Choose PDF source file',
			filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
			properties: ['openFile'],
		})
	)
})

ipcMain.on('choose-song-folders-location', () => {
	mainWindow.webContents.send(
		'user-chose-song-folders-location',
		dialog.showOpenDialogSync(mainWindow, {
			title: 'Choose song folders location',
			message: 'Choose song folders location',
			properties: ['openDirectory'],
		})
	)
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

const isMac = process.platform === 'darwin'

app.setAboutPanelOptions({
	applicationName: app.name,
	applicationVersion: app.getVersion(),
	copyright: 'Copyright © 2022 Colin A. Williams',
})

const template = [
	{ role: 'appMenu' },
	{ role: 'fileMenu' },
	{ role: 'editMenu' },
	{
		label: 'View',
		submenu: [{ role: 'togglefullscreen' }],
	},
	{ role: 'windowMenu' },
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					await shell.openExternal('https://electronjs.org')
				},
			},
		],
	},
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

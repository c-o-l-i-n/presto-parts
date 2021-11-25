const { app, dialog, BrowserWindow, ipcMain, Menu } = require('electron')
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
})

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

const isMac = process.platform === 'darwin'

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
					const { shell } = require('electron')
					await shell.openExternal('https://electronjs.org')
				},
			},
		],
	},
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

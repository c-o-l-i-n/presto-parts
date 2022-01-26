const { app, dialog, BrowserWindow, ipcMain, Menu, shell } = require('electron')
const { separateSongParts } = require('./backend/separateSongParts')
const {
	generateInstrumentPartsAndMaster,
} = require('./backend/generateInstrumentPartsAndMaster')

let mainWindow
let aboutWindow
let appIsQuitting = false

const showMessageBox = (type, message) => {
	dialog.showMessageBox(mainWindow, { type: type, message: message })
}

createWindow = () => {
	mainWindow = new BrowserWindow({
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

	mainWindow.loadFile('frontend/separate.html')

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	mainWindow.on('close', (e) => {
		app.quit()
	})

	aboutWindow = new BrowserWindow({
		show: false,
		width: 270,
		height: 278,
		resizable: false,
		minimizable: false,
		maximizable: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	aboutWindow.loadFile('frontend/about.html').then(() => {
		aboutWindow.webContents.send('app-info', {
			name: app.name,
			version: app.getVersion(),
		})
	})

	// hide window rather than destroy it on close
	aboutWindow.on('close', (e) => {
		// if this isn't here, the app won't ever quit
		if (!appIsQuitting) {
			e.preventDefault()
			aboutWindow.hide()
		}
	})
}

app.whenReady().then(() => {
	createWindow()
})

app.on('before-quit', function (evt) {
	appIsQuitting = true
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

const template = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: 'About ' + app.name,
							click: () => {
								aboutWindow.show()
							},
						},
						{ type: 'separator' },
						{ role: 'services' },
						{ type: 'separator' },
						{ role: 'hide' },
						{ role: 'hideOthers' },
						{ role: 'unhide' },
						{ type: 'separator' },
						{ role: 'quit' },
					],
				},
		  ]
		: []),
	{ role: 'fileMenu' },
	{ role: 'editMenu' },
	...(isMac
		? [
				{
					label: 'View',
					submenu: [{ role: 'togglefullscreen' }],
				},
		  ]
		: []),
	{ role: 'windowMenu' },
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					await shell.openExternal('https://prestoparts.org')
				},
			},
		],
	},
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

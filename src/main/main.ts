import { app, BrowserWindow, shell } from 'electron'
import contextMenu from 'electron-context-menu'
import unhandled from 'electron-unhandled'
import os from 'os'
import createAppMenu from './menu'
import setupIpcMain from './ipc-main'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const ABOUT_WINDOW_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) process.exit()

const sendErrorReport = (
	os: NodeJS.Platform,
	osVersion: string,
	appVersion: string,
	electronVersion: string,
	nodeVersion: string,
	chromeVersion: string,
	stackTrace: string
) => {
	const params = new URLSearchParams({
		os: os,
		osv: osVersion,
		av: appVersion,
		ev: electronVersion,
		nv: nodeVersion,
		cv: chromeVersion,
		stack: stackTrace,
	})

	shell.openExternal('https://prestoparts.org/report?' + params.toString())
}

// handles unhandled errors
unhandled({
	showDialog: true,
	reportButton: (error) => {
		sendErrorReport(
			process.platform,
			os.release(),
			app.getVersion(),
			process.versions.electron,
			process.versions.node,
			process.versions.chrome,
			error.stack
		)
	},
})

const isMac = process.platform === 'darwin'

// Fixes strange behavior with window size on Windows 10
const mainWindowWidth = isMac ? 770 : 786
const mainWindowMinimumWidth = mainWindowWidth
const mainWindowHeight = isMac ? 660 : 0
const mainWindowMinimumHeight = isMac ? mainWindowHeight : 700

let mainWindow: BrowserWindow
let aboutWindow: BrowserWindow
let appIsQuitting = false

contextMenu({
	menu: (actions, props, browserWindow, dictionarySuggestions) => [
		...dictionarySuggestions,
		actions.separator(),
		actions.cut({}),
		actions.copy({}),
		actions.paste({}),
	],
})

const createWindow = () => {
	mainWindow = new BrowserWindow({
		show: false,
		width: mainWindowWidth,
		height: mainWindowHeight,
		minWidth: mainWindowMinimumWidth,
		minHeight: mainWindowMinimumHeight,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	mainWindow.on('close', () => {
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

	aboutWindow.setMenu(null)

	aboutWindow.loadURL(ABOUT_WINDOW_WEBPACK_ENTRY).then(() => {
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
	createAppMenu(isMac, app, aboutWindow)
})

app.on('before-quit', () => {
	appIsQuitting = true
})

setupIpcMain(mainWindow)

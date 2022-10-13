import { app, BrowserWindow, shell } from 'electron'
import contextMenu from 'electron-context-menu'
import unhandled from 'electron-unhandled'
import os from 'os'
import setApplicationMenu from './menu'
import setupIpcMain from './ipc-main'
import { ErrorReport, ExternalSite } from '../types/types'
import ElectronSquirrelStartup = require('electron-squirrel-startup')

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const ABOUT_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
declare const ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (ElectronSquirrelStartup) process.exit()

const sendErrorReport = (errorReport: ErrorReport): void => {
  const params = new URLSearchParams({ ...errorReport })
  void shell.openExternal(`${ExternalSite.APP_WEBSITE}/report?${params.toString()}`)
}

// handles unhandled errors
unhandled({
  showDialog: true,
  reportButton: (error) => {
    sendErrorReport({
      os: process.platform,
      osVersion: os.release(),
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      chromeVersion: process.versions.chrome,
      stackTrace: error.stack ?? ''
    })
  }
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
    actions.paste({})
  ]
})

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    show: false,
    width: mainWindowWidth,
    height: mainWindowHeight,
    minWidth: mainWindowMinimumWidth,
    minHeight: mainWindowMinimumHeight,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  })

  setupIpcMain(mainWindow)

  void mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.once('ready-to-show', () => {
    createAboutWindow()
    setApplicationMenu(isMac, aboutWindow)
    mainWindow.show()
  })

  mainWindow.on('close', () => {
    app.quit()
  })

  const createAboutWindow = (): void => {
    aboutWindow = new BrowserWindow({
      show: false,
      width: 270,
      height: 278,
      resizable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        preload: ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY
      }
    })

    aboutWindow.setMenu(null)

    void aboutWindow.loadURL(ABOUT_WINDOW_WEBPACK_ENTRY)

    // hide window rather than destroy it on close
    aboutWindow.on('close', (e) => {
      // if this isn't here, the app won't ever quit
      if (!appIsQuitting) {
        e.preventDefault()
        aboutWindow.hide()
      }
    })
  }
}

void app.whenReady().then(() => {
  createWindow()
})

app.on('before-quit', () => {
  appIsQuitting = true
})

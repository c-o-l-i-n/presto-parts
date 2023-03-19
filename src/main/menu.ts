import { app, BrowserWindow, Menu, shell } from 'electron'
import { ExternalSite } from '../types/types'

const buildDefaultMenuTemplate = (
  aboutWindow: BrowserWindow
): Electron.MenuItemConstructorOptions[] => [
  { role: 'fileMenu' },
  { role: 'editMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => { void shell.openExternal(ExternalSite.APP_WEBSITE) }
      },
      { type: 'separator' },
      {
        label: 'About ' + app.name,
        click: () => aboutWindow.show()
      }
    ]
  }
]

const buildMacMenuTemplate = (
  aboutWindow: BrowserWindow
): Electron.MenuItemConstructorOptions[] => [
  {
    label: app.name,
    submenu: [
      {
        label: 'About ' + app.name,
        click: () => aboutWindow.show()
      },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  { role: 'fileMenu' },
  { role: 'editMenu' },
  {
    label: 'View',
    submenu: [{ role: 'togglefullscreen' }]
  },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => { void shell.openExternal(ExternalSite.APP_WEBSITE) }
      }
    ]
  }
]

const setApplicationMenu = (isMac: boolean, aboutWindow: BrowserWindow): void =>
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(
      isMac
        ? buildMacMenuTemplate(aboutWindow)
        : buildDefaultMenuTemplate(aboutWindow)
    )
  )

export default setApplicationMenu

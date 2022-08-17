import { App, BrowserWindow, Menu, shell } from 'electron'

const createAppMenu = (
	isMac: boolean,
	app: App,
	aboutWindow: BrowserWindow
) => {
	const template: Electron.MenuItemConstructorOptions[] = []

	if (isMac) {
		template.push({
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
		})
	}

	template.push({ role: 'fileMenu' })
	template.push({ role: 'editMenu' })
	template.push({ role: 'fileMenu' })

	if (isMac) {
		template.push({
			label: 'View',
			submenu: [{ role: 'togglefullscreen' }],
		})
	}

	template.push({ role: 'windowMenu' })

	const helpSubmenu: Electron.MenuItemConstructorOptions[] = [
		{
			label: 'Learn More',
			click: async () => {
				await shell.openExternal('https://prestoparts.org')
			},
		},
	]

	if (isMac) {
		helpSubmenu.push({ type: 'separator' })
		helpSubmenu.push({
			label: 'About',
			click: async () => {
				aboutWindow.show()
			},
		})
	}

	const helpMenu: {
		role: 'help'
		submenu: Electron.MenuItemConstructorOptions[]
	} = { role: 'help', submenu: helpSubmenu }

	template.push(helpMenu)

	const appMenu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(appMenu)
}

export default createAppMenu

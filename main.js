const { app, BrowserWindow } = require('electron')
const path = require('path')

let backend

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
			const errorMessage = data.toString('utf-8').match(/(?<=: )(.*)\n$/gm)
			window.webContents.send('backend-error', errorMessage)
		})
	} else {
		backend = require('child_process').exec('./backend/dist/backend')
		backend.stderr.on('data', (data) => {
			const errorMessage = data.toString('utf-8').match(/(?<=: )(.*)\n$/gm)
			window.webContents.send('backend-error', errorMessage)
		})
	}
}

const terminateBackend = () => {
	backend.kill()
}

createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	win.loadFile('frontend/separate.html')

	return win
}

app.whenReady().then(() => {
	const win = createWindow()
	startBackend(win, (debugMode = false))
})

app.on('before-quit', terminateBackend)

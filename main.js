const { app, BrowserWindow } = require('electron')
const path = require('path')

let backend

const startBackend = (debugMode) => {
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
		})
	} else {
		console.log("I haven't figured out executable mode yet")
		app.quit()

		// backend = path.join(process.cwd(), 'resources/backend/dist/backend.exe')

		// let execFile = require('child_process').execFile

		// execFile(backend, { windowsHide: true }, (err, stdout, stderr) => {
		// 	if (err) {
		// 		console.log(err.toString('utf-8'))
		// 	}
		// 	if (stdout) {
		// 		console.log(stdout.toString('utf-8'))
		// 	}
		// 	if (stderr) {
		// 		console.log(stderr.toString('utf-8'))
		// 	}
		// })
	}
}

const terminateBackend = () => {
	backend.kill()
}

createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	})

	win.loadFile('separate.html')
}

app.whenReady().then(() => {
	createWindow()
	startBackend((debugMode = true))
})

app.on('before-quit', terminateBackend)

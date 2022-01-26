// DOM Elements
const appNameElement = document.getElementById('app-name')
const appVersionElement = document.getElementById('app-version')

// sets "about" info
ipcRenderer.once('app-info', (e, appInfo) => {
	document.title = 'About ' + appInfo.name
	appNameElement.innerText = appInfo.name
	appVersionElement.innerText = appInfo.version
})

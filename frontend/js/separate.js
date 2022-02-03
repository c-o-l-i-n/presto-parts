// DOM Elements
const songTitleElement = document.getElementById('song-title')
const pdfSourcePathElement = document.getElementById('pdf-source-path')
const partsListElement = document.getElementById('parts-list')
const chooseFileButtonElement = document.getElementById('choose-file-button')

// persistent storage
const persistentStoragePrefix = 'separate'
const persistentStorageElements = [
	songTitleElement,
	pdfSourcePathElement,
	partsListElement,
]
initializePersistentStorage(persistentStoragePrefix, persistentStorageElements)

// send data to backend on submit button click
submitButtonElement.addEventListener('click', (e) => {
	ipcRenderer.send(
		'separate',
		pdfSourcePathElement.value,
		partsListElement.value,
		songTitleElement.value
	)
})

// populates file path on file drop
document.addEventListener('drop', (e) => {
	handleFileDrop(e, 'PDF', pdfSourcePathElement)
})

// open file dialog on "Choose File" button click
chooseFileButtonElement.addEventListener('click', () => {
	ipcRenderer.send('choose-pdf-source-file')
	chooseFileButtonElement.blur()
})

// set textbox value to chosen file path
ipcRenderer.on('user-chose-pdf-source-file', (e, filePath) => {
	if (filePath) {
		pdfSourcePathElement.value = filePath
	}
})

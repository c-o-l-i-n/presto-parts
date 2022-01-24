// DOM Elements
const songTitleElement = document.getElementById('song-title')
const pdfSourcePathElement = document.getElementById('pdf-source-path')
const partsListElement = document.getElementById('parts-list')
const chooseFileButtonElement = document.getElementById('choose-file-button')

// send data to backend on submit button click
submitButtonElement.addEventListener('click', (e) => {
	ipcRenderer.send(
		'separate',
		pdfSourcePathElement.value,
		partsListElement.value,
		songTitleElement.value
	)
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

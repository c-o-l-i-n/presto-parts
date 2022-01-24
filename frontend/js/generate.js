// DOM Elements
const collectionNameElement = document.getElementById('collection-name')
const songFoldersLocationElement = document.getElementById(
	'song-folders-location'
)
const songListElement = document.getElementById('song-list')
const partsListElement = document.getElementById('parts-list')
const chooseFolderButtonElement = document.getElementById(
	'choose-folder-button'
)

// send data to backend on submit button click
submitButtonElement.addEventListener('click', (e) => {
	ipcRenderer.send(
		'generate',
		collectionNameElement.value,
		songFoldersLocationElement.value,
		songListElement.value,
		partsListElement.value
	)
})

// populates file path on file drop
document.addEventListener('drop', (e) => {
	handleFileDrop(e, 'folder', songFoldersLocationElement)
})

// open file dialog on "Choose File" button click
chooseFolderButtonElement.addEventListener('click', () => {
	ipcRenderer.send('choose-song-folders-location')
	chooseFolderButtonElement.blur()
})

// set textbox value to chosen file path
ipcRenderer.on('user-chose-song-folders-location', (e, folderPath) => {
	if (folderPath) {
		songFoldersLocationElement.value = folderPath
	}
})

const { ipcRenderer, shell } = require('electron')
const fs = require('fs')
const path = require('path')

// DOM Elelements
const dropZoneElement = document.getElementById('drop-zone')
const mainElement = document.getElementById('main')
const submitButtonElement = document.getElementById('submit-button')
const loaderElement = document.getElementById('loader')
const externalLinkElements = document.getElementsByClassName('external-link')

// show the loader screen overlay
const showLoader = () => {
	loaderElement.classList.add('is-active')
}

// show the loader screen overlay
const hideLoader = () => {
	loaderElement.classList.remove('is-active')
}

// show the drop-zone overlay
const showDropZone = () => {
	dropZoneElement.classList.add('is-active')
}

// show the loader screen overlay
const hideDropZone = () => {
	dropZoneElement.classList.remove('is-active')
}

// clear form
const clearForm = () => {
	const formElements = document.querySelectorAll(
		'input:not([type=button]):not([type=reset]):not([type=submit]):not([type=image]), textarea'
	)
	for (element of formElements) {
		element.value = ''
	}
}

ipcRenderer.on('show-loader', showLoader)
ipcRenderer.on('hide-loader', hideLoader)
ipcRenderer.on('clear-form', clearForm)

// hide drop zone when user drops file
document.addEventListener('drop', (e) => {
	e.preventDefault()
	e.stopPropagation()
	hideDropZone()
})

// prevent default on file drag over
document.addEventListener('dragover', (e) => {
	e.preventDefault()
	e.stopPropagation()
})

let lastDragTarget

// show drop zone when user drags a file onto the window
document.addEventListener('dragenter', (e) => {
	lastDragTarget = e.target
	showDropZone()
})

// hide drop zone when user drags file off the window
document.addEventListener('dragleave', (e) => {
	if (e.target === lastDragTarget || e.target === document) {
		hideDropZone()
	}
})

// populate file path and handles errors when user drops file
const handleFileDrop = (e, desiredFileType, destinationInputElement) => {
	if (!e.dataTransfer.files[0]) {
		ipcRenderer.send(
			'show-message-box',
			'error',
			`Error: Must be a ${desiredFileType}.`
		)
		return
	}

	const filePath = e.dataTransfer.files[0].path
	const isFolder = fs.statSync(filePath).isDirectory()
	console.log(filePath)

	const fileType = isFolder
		? 'folder'
		: !path.extname(filePath)
		? 'file with no type'
		: path.extname(filePath).split('.').pop().toUpperCase()

	if (e.dataTransfer.files.length !== 1) {
		ipcRenderer.send(
			'show-message-box',
			'error',
			`Error: Must be a single file.\n${e.dataTransfer.files.length} file${
				e.dataTransfer.files.length === 0 ? ' was' : 's were'
			} dropped.`
		)
		return
	}

	if (fileType !== desiredFileType) {
		const lettersPrecededByAn = 'AEFHILMNORSX'
		ipcRenderer.send(
			'show-message-box',
			'error',
			`Error: Must be a ${desiredFileType}.\nA${
				lettersPrecededByAn.includes(fileType.charAt(0)) ? 'n' : ''
			} ${fileType} was dropped.`
		)
		return
	}

	destinationInputElement.value = filePath
}

// make external links functional
for (const externalLinkElement of externalLinkElements) {
	externalLinkElement.addEventListener('click', () => {
		shell.openExternal(externalLinkElement.dataset.href)
	})
}

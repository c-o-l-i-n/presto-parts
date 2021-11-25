const { ipcRenderer } = require('electron')

// DOM Elelements
const mainElement = document.getElementById('main')
const submitButtonElement = document.getElementById('submit-button')
const loaderElement = document.getElementById('loader')

// show the loader screen overlay
const showLoader = () => {
	loaderElement.classList.add('is-active')
}

// show the loader screen overlay
const hideLoader = () => {
	loaderElement.classList.remove('is-active')
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

const axios = require('axios')
const { ipcRenderer } = require('electron')

// DOM Elelements
const mainElement = document.getElementById('main')
const submitButtonElement = document.getElementById('submit-button')
const loaderElement = document.getElementById('loader')

// send data to backend
const submitForm = (endpoint, data) => {
	loaderElement.classList.add('is-active')
	axios
		.post('http://127.0.0.1:14161/' + endpoint, data)
		.then((response) => {
			loaderElement.classList.remove('is-active')
			clearForm()
			ipcRenderer.send('show-message-box', 'info', response.data)
		})
		.catch((error) => {
			loaderElement.classList.remove('is-active')
			console.log(error)
		})
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

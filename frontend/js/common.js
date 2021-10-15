const axios = require('axios')
const { ipcRenderer } = require('electron')

// DOM Elelements
const submitButtonElement = document.getElementById('submit-button')
const loaderElement = document.getElementById('loader')
const notificationElement = document.getElementById('notification')
const notificationTextElement = document.getElementById('notification-text')
const closeNotificationButtonElement = document.getElementById(
	'close-notification-btn'
)

// send data to backend
const submitForm = (endpoint, data) => {
	loaderElement.classList.add('is-active')
	axios
		.post('http://127.0.0.1:14161/' + endpoint, data)
		.then((response) => {
			loaderElement.classList.remove('is-active')
			clearForm()
			showNotification(true, response.data)
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
	errorElement.style.display = 'none'
}

// show notification
const showNotification = (isGreen, text) => {
	notificationElement.classList.remove('is-success')
	notificationElement.classList.remove('is-danger')
	notificationElement.classList.add(isGreen ? 'is-success' : 'is-danger')
	notificationTextElement.innerText = isGreen ? '🎉\xa0\xa0' + text : text
	notificationElement.style.display = 'block'
}

// display backend errors
ipcRenderer.on('backend-error', (e, message) => {
	showNotification(false, message)
	loaderElement.classList.remove('is-active')
})

// close notification box on button click
closeNotificationButtonElement.addEventListener('click', (e) => {
	notificationElement.style.display = 'none'
})

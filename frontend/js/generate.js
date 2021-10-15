// DOM Elements
const collectionNameElement = document.getElementById('collection-name')
const songFoldersLocationElement = document.getElementById(
	'song-folders-location'
)
const songListElement = document.getElementById('song-list')
const partsListElement = document.getElementById('parts-list')
const submitButtonElement = document.getElementById('submit-button')
const loaderElement = document.getElementById('loader')
const notificationElement = document.getElementById('notification')
const notificationTextElement = document.getElementById('notification-text')
const closeNotificationButtonElement = document.getElementById(
	'close-notification-btn'
)

// send data to backend on submit button click
submitButtonElement.addEventListener('click', (e) => {
	submitForm('generate', {
		'collection-name': collectionNameElement.value,
		'song-folders-location': songFoldersLocationElement.value,
		'song-list': songListElement.value,
		'parts-list': partsListElement.value,
	})
})

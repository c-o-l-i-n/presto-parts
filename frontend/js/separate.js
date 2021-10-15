// DOM Elements
const songTitleElement = document.getElementById('song-title')
const pdfSourcePathElement = document.getElementById('pdf-source-path')
const partsListElement = document.getElementById('parts-list')

// send data to backend on submit button click
submitButtonElement.addEventListener('click', (e) => {
	submitForm('separate', {
		'song-title': songTitleElement.value,
		'pdf-source-path': pdfSourcePathElement.value,
		'parts-list': partsListElement.value,
	})
})

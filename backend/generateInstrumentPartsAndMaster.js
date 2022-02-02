const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const validFilename = require('valid-filename')

const directorySeparator = process.platform === 'win32' ? '\\' : '/'

const generateInstrumentPartsAndMaster = async (
	collectionName,
	songFoldersLocation,
	songList,
	instrumentPartsList
) => {
	const destinationDirectory = `${songFoldersLocation}${directorySeparator}${collectionName}`

	if (!validFilename(prefix)) {
		throw `"${collectionName}" is not a valid folder name. Please try something different.`
	}

	if (!fs.existsSync(songFoldersLocation)) {
		throw 'Error: The Song Folders Location does not exist.'
	}

	if (fs.existsSync(destinationDirectory)) {
		throw `Error: Cannot create destination folder.\n\nA folder named "${destinationDirectory}" already exists.`
	}

	// generate list of parts and number of respective copies based on given input
	let numCopiesOfPart = {}
	for (part of instrumentPartsList.split(/\r?\n/)) {
		// split line into part name and number of copies
		let partNameAndNumCopies = part.split('#')

		// remove spaces from part name
		partNameAndNumCopies[0] = partNameAndNumCopies[0].replace(/\s/g, '')

		// skip part if blank
		if (!partNameAndNumCopies[0]) {
			continue
		}

		// set default num copies to 1 or convert num copies from str to int
		if (partNameAndNumCopies.length < 2) {
			partNameAndNumCopies.push(1)
		} else {
			partNameAndNumCopies[1] = parseInt(partNameAndNumCopies[1])
		}

		// add part and its number of pages to dict
		numCopiesOfPart[partNameAndNumCopies[0]] = partNameAndNumCopies[1]
	}

	// create Master PDF document (contains all copies of all parts)
	let masterPdfDocument = await PDFDocument.create()

	// create PDF for each instrument
	let instrumentPdfFiles = []
	for (instrument in numCopiesOfPart) {
		const instrumentPartFilePath = `${destinationDirectory}${directorySeparator}${collectionName}-${instrument}.pdf`

		let instrumentPartPdfDocument = await PDFDocument.create()

		// get this instrument's part from each song
		for (songName of songList.split(/\r?\n/)) {
			// remove spaces from song name
			songName = songName.replace(/\s/g, '')

			// skip songName if blank
			if (!songName) {
				continue
			}

			// get instrument part PDF from this song
			const songDirectory = `${songFoldersLocation}${directorySeparator}${songName}`
			const partFile = fs.readFileSync(
				`${songDirectory}${directorySeparator}${songName}-${instrument}.pdf`
			)
			let partFileReader = await PDFDocument.load(partFile)

			// copy the pages to the instrument part
			const copiedPages = await instrumentPartPdfDocument.copyPages(
				partFileReader,
				partFileReader.getPageIndices()
			)
			for (page of copiedPages) {
				instrumentPartPdfDocument.addPage(page)
			}

			// if working with a score, special case, add a blank page after each if there is an odd number of pages in the score
			if (
				instrument.toLowerCase() === 'score' &&
				partFileReader.getPageCount() % 2 === 1
			) {
				addBlankPage(instrumentPartPdfDocument)
			}
		}

		// export instrument part PDF
		const isntrumentPartFileData = await instrumentPartPdfDocument.save()
		instrumentPdfFiles.push({
			path: instrumentPartFilePath,
			data: isntrumentPartFileData,
		})

		// add instrument part PDF to master PDF
		for (let i = 0; i < numCopiesOfPart[instrument]; i++) {
			const copiedPages = await masterPdfDocument.copyPages(
				instrumentPartPdfDocument,
				instrumentPartPdfDocument.getPageIndices()
			)
			for (page of copiedPages) {
				masterPdfDocument.addPage(page)
			}

			// if odd number of pages in instrument part, add blank page for double sided printing
			if (instrumentPartPdfDocument.getPageCount() % 2 === 1) {
				addBlankPage(masterPdfDocument)
			}
		}
	}

	// create destination directory for the new PDF files
	fs.mkdirSync(destinationDirectory)

	// export isntrument part PDF files
	for (instrumentPdfFile of instrumentPdfFiles) {
		fs.writeFileSync(instrumentPdfFile.path, instrumentPdfFile.data)
	}

	// export master PDF file
	fs.writeFileSync(
		`${destinationDirectory}/${collectionName}-MASTER.pdf`,
		await masterPdfDocument.save()
	)

	return destinationDirectory
}

const addBlankPage = (pdfDocument) => {
	const previousPageSize = pdfDocument
		.getPage(pdfDocument.getPageCount() - 1)
		.getSize()
	// add a blank page with the same dimensions as the previos page
	pdfDocument.addPage([previousPageSize.width, previousPageSize.height])
}

module.exports = { generateInstrumentPartsAndMaster }

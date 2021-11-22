const { PDFDocument, degrees } = require('pdf-lib')
const fs = require('fs')

const separateSongParts = async (sourcePath, partsList, prefix) => {
	// 	Sepatates song parts based on a list of part names and number of pages for each part.
	// 	Format is shown below: part name followed by #num_pages (1 is default)
	//
	// 	Score #9
	// 	Flute
	// 	Clarinet #2
	// 	Alto Saxophone
	// 	etc ...
	//

	if (!fs.existsSync(sourcePath)) {
		throw 'The given PDF source file does not exist'
	}

	if (sourcePath.slice(-4) != '.pdf') {
		throw 'The given PDF source file is not a PDF'
	}

	let numPagesForPart = {}
	let pagesSum = 0
	for (line of partsList.split(/\r?\n/)) {
		// split line into part name and number of pages
		let partNameAndNumPages = line.split('#')
		// remove spaces from part name
		partNameAndNumPages[0] = partNameAndNumPages[0].replace(/\s/g, '')
		// set default page number to 1 or convert page number from str to int
		if (partNameAndNumPages.length < 2) {
			partNameAndNumPages.push(1)
		} else {
			partNameAndNumPages[1] = parseInt(partNameAndNumPages[1])
		}
		// add part and its number of pages to dict
		numPagesForPart[partNameAndNumPages[0]] = partNameAndNumPages[1]
		// add to the total number of pages in document
		pagesSum += partNameAndNumPages[1]
	}

	// get source file
	const sourceFile = fs.readFileSync(sourcePath)

	// create source PDF object
	const source = await PDFDocument.load(sourceFile)

	// make sure actual page # of src matches part names list
	if (source.getPageCount() != pagesSum) {
		throw `Incorrect number of pages in Parts List.\n\nThe PDF source has ${source.getPageCount()} pages, but you listed ${pagesSum}.`
	}

	// check that destination directory name is available
	const sourceFileDirectory = sourcePath.substring(
		0,
		sourcePath.lastIndexOf('/')
	)
	const destinationDirecrory = `${sourceFileDirectory}/${prefix}`
	if (fs.existsSync(destinationDirecrory)) {
		throw `A folder named "${prefix}" already exists at the PDF location`
	}

	// generate PDF for each part in the given list
	let startingPage = 0
	let generatedPdfs = []
	for (part in numPagesForPart) {
		// create PDF object
		let partPdf = await PDFDocument.create()
		// get each page of part
		for (let i = 0; i < numPagesForPart[part]; i++) {
			// get page from source PDF
			const page = (await partPdf.copyPages(source, [startingPage + i]))[0]
			// flip even pages (odd here since indexing starts at 0)
			if (i % 2 == 1) {
				page.setRotation(degrees(180))
			}
			partPdf.addPage(page)
		}
		startingPage += numPagesForPart[part]

		// generate file name
		const destFileName = `${destinationDirecrory}/${prefix}-${part}.pdf`

		// save PDF file bytes
		const pdfBytes = await partPdf.save()

		// add PDF to list
		generatedPdfs.push([destFileName, pdfBytes])
	}

	// write PDF files to disk
	fs.mkdirSync(destinationDirecrory)
	for ([fileName, pdf] of generatedPdfs) {
		fs.writeFileSync(fileName, pdf)
	}

	return destinationDirecrory
}

module.exports = { separateSongParts }

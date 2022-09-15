import { SeparatePayload } from '../types/types'
import { PDFDocument, degrees } from 'pdf-lib'
import path from 'path'
import fs from 'fs'
import validFilename from 'valid-filename'

const separateSongParts = async (payload: SeparatePayload): Promise<string> => {
  // Sepatates song parts based on a list of part names and number of pages for each part.
  // Format is shown below: part name followed by #num_pages (1 is default)
  //
  // Score #9
  // Flute
  // Clarinet #2
  // Alto Saxophone
  // etc ...
  //

  // unwrap payload
  const { pdfSourcePath, partsList } = payload
  let { songTitle } = payload

  // trim spaces from song name
  songTitle = songTitle.trim()

  if (!validFilename(songTitle)) {
    throw new Error(`Error: Song Title must be a valid folder name. "${songTitle}" is not a valid folder name. Please try something different.`)
  }

  if (!fs.existsSync(pdfSourcePath)) {
    throw new Error('Error: The given PDF source file does not exist.')
  }

  if (pdfSourcePath.slice(-4).toLowerCase() !== '.pdf') {
    throw new Error('Error: The given PDF source file is not a PDF.')
  }

  const numPagesForPart: { [key: string]: number } = {}
  let pagesSum = 0

  for (const line of partsList.split(/\r?\n/)) {
    // split line into part name and number of pages
    let [partName, numPages]: [string, number?] = [
      line.split('#')[0],
      parseInt(line.split('#')[1])
    ]
    // trim spaces from part name
    partName = partName.trim()
    // skip line if blank
    if (partName[0] === '') {
      continue
    }
    // check if part is valid file name
    if (!validFilename(partName)) {
      throw new Error(`Error: Each part must be a valid file name. "${partName}" is not a valid file name. Please try something different.`)
    }
    // set default page number to 1 or convert page number from str to int
    if (isNaN(numPages)) {
      numPages = 1
    }
    // add part and its number of pages to dict
    numPagesForPart[partName] = numPages
    // add to the total number of pages in document
    pagesSum += numPages
  }

  // get source file
  const sourceFile = fs.readFileSync(pdfSourcePath)

  // create source PDF object
  const source = await PDFDocument.load(sourceFile)

  // make sure actual page # of src matches part names list
  if (source.getPageCount() !== pagesSum) {
    throw new Error(`Error: Incorrect number of pages in Parts List.\n\nThe PDF source has ${source.getPageCount()} pages, but ${pagesSum} ${pagesSum === 1 ? 'was' : 'were'} listed.`)
  }

  // check that destination directory name is available
  const sourceFileDirectory = pdfSourcePath.substring(0, pdfSourcePath.lastIndexOf(path.sep))
  const destinationDirecrory = `${sourceFileDirectory}${path.sep}${songTitle}`
  if (fs.existsSync(destinationDirecrory)) {
    throw new Error(`Error: A folder named "${songTitle}" already exists at the PDF location.`)
  }

  // generate PDF for each part in the given list
  let startingPage = 0
  const generatedPdfs: Array<[string, Uint8Array]> = []
  for (const part in numPagesForPart) {
    // create PDF object
    const partPdf = await PDFDocument.create()
    // get each page of part
    for (let i = 0; i < numPagesForPart[part]; i++) {
      // get page from source PDF
      const page = (await partPdf.copyPages(source, [startingPage + i]))[0]
      // flip even pages (odd here since indexing starts at 0)
      if (i % 2 === 1) {
        page.setRotation(degrees(180))
      }
      partPdf.addPage(page)
    }
    startingPage += numPagesForPart[part]

    // generate file name
    const destFileName = `${destinationDirecrory}${path.sep}${songTitle} - ${part}.pdf`

    // save PDF file bytes
    const pdfBytes = await partPdf.save()

    // add PDF to list
    generatedPdfs.push([destFileName, pdfBytes])
  }

  // write PDF files to disk
  fs.mkdirSync(destinationDirecrory)
  for (const [fileName, pdf] of generatedPdfs) {
    fs.writeFileSync(fileName, pdf)
  }

  return destinationDirecrory
}

export default separateSongParts

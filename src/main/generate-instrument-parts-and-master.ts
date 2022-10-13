import { PDFDocument } from 'pdf-lib'
import path from 'path'
import fs from 'fs'
import validFilename from 'valid-filename'
import { GeneratePayload } from '../types/types'

const generateInstrumentPartsAndMaster = async (payload: GeneratePayload): Promise<string> => {
  // unwrap payload
  const { collectionName, songFoldersLocation, songList, instrumentPartsList } = payload

  const destinationDirectory = `${songFoldersLocation}${path.sep}${collectionName}`

  if (!validFilename(collectionName)) {
    throw new Error(`Error: Collection Name must be a valid folder name. "${collectionName}" is not a valid folder name. Please try something different.`)
  }

  if (!fs.existsSync(songFoldersLocation)) {
    throw new Error('Error: The Song Folders Location does not exist.')
  }

  if (fs.existsSync(destinationDirectory)) {
    throw new Error(`Error: Cannot create destination folder.\n\nA folder named "${destinationDirectory}" already exists.`)
  }

  // generate list of parts and number of respective copies based on given input
  const numCopiesOfPart: { [key: string]: number } = {}
  for (const part of instrumentPartsList.split(/\r?\n/)) {
    // split line into part name and number of copies
    let [partName, numCopies] = [
      part.split('#')[0],
      parseInt(part.split('#')[1])
    ]

    // trim spaces from part name
    partName = partName.trim()

    // skip part if blank
    if (partName === '') {
      continue
    }

    // set default num copies to 1
    if (isNaN(numCopies)) {
      numCopies = 1
    }

    // add part and its number of pages to dict
    numCopiesOfPart[partName] = numCopies
  }

  // create Master PDF document (contains all copies of all parts)
  const masterPdfDocument = await PDFDocument.create()

  // create PDF for each instrument
  const instrumentPdfFiles: Array<{ path: string, data: Uint8Array }> = []
  for (let instrument in numCopiesOfPart) {
    // trim spaces from instrument name
    instrument = instrument.trim()

    const instrumentPartFilePath = `${destinationDirectory}${path.sep}${collectionName} - ${instrument}.pdf`

    const instrumentPartPdfDocument = await PDFDocument.create()

    // get this instrument's part from each song
    for (let songName of songList.split(/\r?\n/)) {
      // trim spaces from song name
      songName = songName.trim()

      // skip songName if blank
      if (songName === '') {
        continue
      }

      // get instrument part PDF from this song
      const songDirectory = `${songFoldersLocation}${path.sep}${songName}`

      const partFilePath = `${songDirectory}${path.sep}${songName} - ${instrument}.pdf`

      if (!fs.existsSync(partFilePath)) {
        throw new Error(`Error: Could not find "${instrument}" part for song "${songName}". File does not exist: "${partFilePath}"`)
      }

      const partFile = fs.readFileSync(partFilePath)
      const partFileReader = await PDFDocument.load(partFile)

      // copy the pages to the instrument part
      const copiedPages = await instrumentPartPdfDocument.copyPages(
        partFileReader,
        partFileReader.getPageIndices()
      )
      for (const page of copiedPages) {
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
      data: isntrumentPartFileData
    })

    // add instrument part PDF to master PDF
    for (let i = 0; i < numCopiesOfPart[instrument]; i++) {
      const copiedPages = await masterPdfDocument.copyPages(
        instrumentPartPdfDocument,
        instrumentPartPdfDocument.getPageIndices()
      )
      for (const page of copiedPages) {
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
  for (const instrumentPdfFile of instrumentPdfFiles) {
    fs.writeFileSync(instrumentPdfFile.path, instrumentPdfFile.data)
  }

  // export master PDF file
  fs.writeFileSync(
    `${destinationDirectory}${path.sep}${collectionName} - MASTER.pdf`,
    await masterPdfDocument.save()
  )

  return destinationDirectory
}

const addBlankPage = (pdfDocument: PDFDocument): void => {
  const previousPageSize = pdfDocument
    .getPage(pdfDocument.getPageCount() - 1)
    .getSize()
  // add a blank page with the same dimensions as the previos page
  pdfDocument.addPage([previousPageSize.width, previousPageSize.height])
}

export default generateInstrumentPartsAndMaster

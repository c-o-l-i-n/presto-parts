import { IpcMainMessage, Page } from '../../../types'
import React, { useContext, useState } from 'react'
import FileUploadField from '../components/FileUploadField'
import GoButton from '../components/GoButton'
import TextAreaField from '../components/TextAreaField'
import TextInputField from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const SeparatePage = () => {
	const { state: activePage } = useContext(ActivePageContext)

	const [songTitle, setSongTitle] = useState('')
	const [pdfSourcePath, setPdfSourcePath] = useState('')
	const [partsList, setPartsList] = useState('')

	if (activePage !== Page.SEPARATE) return

	const choosePdfSourceFile = async () => {
		const filePath = await window.electron.ipcRenderer.invoke(
			IpcMainMessage.CHOOSE_PDF_SOURCE_FILE,
			{
				songTitle,
				pdfSourcePath,
				partsList,
			}
		)

		if (filePath) {
			setPdfSourcePath(filePath[0])
		}
	}

	return (
		<>
			<h1 className='title'>Separate Song Parts</h1>

			<TextInputField
				label='Song Title'
				placeholder='Hey Judy'
				text={songTitle}
				onType={setSongTitle}
			/>

			<FileUploadField
				label='PDF Source'
				placeholder='/Users/Colin/Desktop/Hey_Judy-Score_and_Parts.pdf'
				buttonLabel='Choose File'
				filePath={pdfSourcePath}
				onButtonClick={choosePdfSourceFile}
				onType={setPdfSourcePath}
			/>

			<TextAreaField
				label='Parts List'
				placeholder='Score #5
Flute
Claritnet
Alto Sax
Trumpet
Trombone
Tuba'
				text={partsList}
				onType={setPartsList}
			/>

			<GoButton
				ipcMessage={IpcMainMessage.SEPARATE}
				payload={{ songTitle, pdfSourcePath, partsList }}
			/>
		</>
	)
}

export default SeparatePage

import {
	FileType,
	IpcMainMessage,
	Page,
	SeparatePayload,
} from '../../../types/types'
import React, { useContext, useState } from 'react'
import FileUploadField from '../components/FileUploadField'
import GoButton from '../components/GoButton'
import TextAreaField from '../components/TextAreaField'
import TextInputField from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'
import DropZone from '../components/DropZone'

const SeparatePage = ({
	songTitle: initialSongTitle,
	pdfSourcePath: initialPdfSourcePath,
	partsList: initialPartsList,
}: SeparatePayload) => {
	const { state: activePage } = useContext(ActivePageContext)

	const [songTitle, setSongTitle] = useState(initialSongTitle || '')
	const [pdfSourcePath, setPdfSourcePath] = useState(initialPdfSourcePath || '')
	const [partsList, setPartsList] = useState(initialPartsList || '')

	const thisPage = Page.SEPARATE
	if (activePage !== thisPage) return

	const choosePdfSourceFile = async () => {
		const filePath = await window.electron.invoke(
			IpcMainMessage.CHOOSE_PDF_SOURCE_FILE
		)

		if (filePath) {
			setPdfSourcePath(filePath)
			saveToStore()
		}
	}

	const saveToStore = () => {
		window.electron.saveToStore({ songTitle, pdfSourcePath, partsList })
	}

	return (
		<>
			<DropZone
				text='Drop PDF Source'
				desiredFileType={FileType.PDF}
				onDrop={setPdfSourcePath}
			/>

			<h1 className='title'>{thisPage}</h1>

			<form onSubmit={(e) => e.preventDefault()}>
				<TextInputField
					label='Song Title'
					placeholder='Hey Judy'
					text={songTitle}
					onType={setSongTitle}
					onChange={saveToStore}
				/>
				<FileUploadField
					label='PDF Source'
					placeholder='/Users/Colin/Desktop/Hey_Judy-Score_and_Parts.pdf'
					buttonLabel='Choose File'
					filePath={pdfSourcePath}
					onButtonClick={choosePdfSourceFile}
					onType={setPdfSourcePath}
					onChange={saveToStore}
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
					onChange={saveToStore}
				/>
				<GoButton
					ipcMessage={IpcMainMessage.SEPARATE}
					payload={{ songTitle, pdfSourcePath, partsList }}
				/>
			</form>
		</>
	)
}

export default SeparatePage

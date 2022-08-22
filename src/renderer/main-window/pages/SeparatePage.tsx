import {
	FileType,
	IpcMainMessage,
	Page,
	SeparatePayload,
} from '../../../types/types'
import React, { useContext, useEffect, useState } from 'react'
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

	// a meaningless state whose sole purpose is to trigger a store update when it changes
	// without this, we would write to the disk every keystroke (onType) rather than after done editing field (onChange)
	const [saveToStoreDependency, setSaveToStoreDependency] = useState<boolean>()

	// save all fields to store when any field is changed
	useEffect(() => {
		if (saveToStoreDependency === undefined) return
		window.electron.storeSet({ songTitle, pdfSourcePath, partsList })
	}, [saveToStoreDependency])

	if (activePage !== Page.SEPARATE) return

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
		setSaveToStoreDependency(!saveToStoreDependency)
	}

	return (
		<>
			<DropZone
				text='Drop PDF Source'
				desiredFileType={FileType.PDF}
				onDrop={setPdfSourcePath}
			/>

			<h1 className='title'>Separate Song Parts</h1>

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
		</>
	)
}

export default SeparatePage

import { ipcRenderer } from 'electron'
import React, { useContext, useState } from 'react'
import { IpcMainMessage, IpcRendererMessage, Maybe, Page } from '../../../types'
import FileUploadField from '../components/FileUploadField'
import TextInputField from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const SeparatePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.SEPARATE
	if (activePage !== thisPage) return

	const [songTitle, setSongTitle] = useState('')
	const [pdfSource, setPdfSource] = useState('')

	ipcRenderer.on(
		IpcRendererMessage.USER_CHOSE_PDF_SOURCE_FILE,
		(e, filePath: Maybe<string>) => {
			if (filePath) {
				setPdfSource(filePath)
			}
		}
	)

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
				filePath={pdfSource}
				ipcMessage={IpcMainMessage.CHOOSE_PDF_SOURCE_FILE}
				onType={setPdfSource}
			/>
		</>
	)
}

export default SeparatePage

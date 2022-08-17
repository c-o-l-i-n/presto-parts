import { ipcRenderer } from 'electron'
import React, { useContext, useState } from 'react'
import { IpcMainMessage, IpcRendererMessage, Maybe, Page } from '../../../types'
import FileUploadField from '../components/FileUploadField'
import TextInputField from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const GeneratePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.GENERATE
	if (activePage !== thisPage) return

	const [collectionName, setCollectionName] = useState('')
	const [songFoldersLocation, setSongFoldersLocation] = useState('')

	ipcRenderer.on(
		IpcRendererMessage.USER_CHOSE_SONG_FOLDERS_LOCATION,
		(e, folderPath: Maybe<string>) => {
			if (folderPath) {
				setSongFoldersLocation(folderPath)
			}
		}
	)

	return (
		<>
			<h1 className='title'>Generate Instrument Parts and Master</h1>

			<TextInputField
				label='Collection Name'
				placeholder='Insect Concert'
				text={collectionName}
				onType={setCollectionName}
			/>

			<FileUploadField
				label='Song Folders Location'
				placeholder='/Users/Colin/Desktop'
				buttonLabel='Choose Folder'
				filePath={songFoldersLocation}
				ipcMessage={IpcMainMessage.CHOOSE_SONG_FOLDERS_LOCATION}
				onType={setSongFoldersLocation}
			/>
		</>
	)
}

export default GeneratePage

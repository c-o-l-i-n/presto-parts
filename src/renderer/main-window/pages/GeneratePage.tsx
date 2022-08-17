import { ipcRenderer } from 'electron'
import React, { useContext, useState } from 'react'
import { IpcMainMessage, IpcRendererMessage, Maybe, Page } from '../../../types'
import FileUploadField from '../components/FileUploadField'
import TextAreaField from '../components/TextAreaField'
import TextInputField from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const GeneratePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.GENERATE
	if (activePage !== thisPage) return

	const [collectionName, setCollectionName] = useState('')
	const [songFoldersLocation, setSongFoldersLocation] = useState('')
	const [songList, setSongList] = useState('')
	const [instrumentPartsList, setInstrumentPartsList] = useState('')

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

			<div className='field field-body'>
				<TextAreaField
					label='Song List'
					placeholder='A Week in the Life
Here Comes the Moon
Leave it Be
Eleanor Brigsby
Hey Judy'
					text={songList}
					onType={setSongList}
				/>

				<TextAreaField
					label='Instrument Parts List'
					placeholder='Score
Flute
Claritnet
Alto Sax #2
Trumpet #4
Trombone #2
Tuba #2'
					text={instrumentPartsList}
					onType={setInstrumentPartsList}
				/>
			</div>
		</>
	)
}

export default GeneratePage

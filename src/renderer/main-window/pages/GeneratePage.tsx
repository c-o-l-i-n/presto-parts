import React, { useContext, useState } from 'react'
import { FileType, IpcMainMessage, Page } from '../../../types/types'
import DropZone from '../components/DropZone'
import FileUploadField from '../components/FileUploadField'
import GoButton from '../components/GoButton'
import TextAreaField from '../components/TextAreaField'
import TextInputField from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const GeneratePage = () => {
	const { state: activePage } = useContext(ActivePageContext)

	const [collectionName, setCollectionName] = useState('')
	const [songFoldersLocation, setSongFoldersLocation] = useState('')
	const [songList, setSongList] = useState('')
	const [instrumentPartsList, setInstrumentPartsList] = useState('')

	if (activePage !== Page.GENERATE) return

	const chooseSongFoldersLocation = async () => {
		const folderPath = await window.electron.invoke(
			IpcMainMessage.CHOOSE_SONG_FOLDERS_LOCATION
		)

		if (folderPath) {
			setSongFoldersLocation(folderPath)
		}
	}

	return (
		<>
			<DropZone
				text='Drop Song Folders Location'
				desiredFileType={FileType.FOLDER}
				onDrop={setSongFoldersLocation}
			/>

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
				onButtonClick={chooseSongFoldersLocation}
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

			<GoButton
				ipcMessage={IpcMainMessage.GENERATE}
				payload={{
					collectionName,
					songFoldersLocation,
					songList,
					instrumentPartsList,
				}}
			/>
		</>
	)
}

export default GeneratePage

import React, { useContext, useEffect, useState } from 'react'
import {
	FileType,
	GeneratePayload,
	IpcMainMessage,
	Page,
} from '../../../types/types'
import DropZone from '../components/DropZone'
import FileUploadField from '../components/FileUploadField'
import GoButton from '../components/GoButton'
import TextAreaField from '../components/TextAreaField'
import TextInputField from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const GeneratePage = ({
	collectionName: initialCollectionName,
	songFoldersLocation: initialSongFoldersLocation,
	songList: initialSongList,
	instrumentPartsList: initialInstrumentPartsList,
}: GeneratePayload) => {
	const { state: activePage } = useContext(ActivePageContext)

	const [collectionName, setCollectionName] = useState(
		initialCollectionName || ''
	)
	const [songFoldersLocation, setSongFoldersLocation] = useState(
		initialSongFoldersLocation || ''
	)
	const [songList, setSongList] = useState(initialSongList || '')
	const [instrumentPartsList, setInstrumentPartsList] = useState(
		initialInstrumentPartsList || ''
	)

	// a meaningless state whose sole purpose is to trigger a store update when it changes
	// without this, we would write to the disk every keystroke (onType) rather than after done editing field (onChange)
	const [saveToStoreDependency, setSaveToStoreDependency] = useState<boolean>()

	// save all fields to store when any field is changed
	useEffect(() => {
		if (saveToStoreDependency === undefined) return
		window.electron.storeSet({
			collectionName,
			songFoldersLocation,
			songList,
			instrumentPartsList,
		})
	}, [saveToStoreDependency])

	if (activePage !== Page.GENERATE) return

	const chooseSongFoldersLocation = async () => {
		const folderPath = await window.electron.invoke(
			IpcMainMessage.CHOOSE_SONG_FOLDERS_LOCATION
		)

		if (folderPath) {
			setSongFoldersLocation(folderPath)
			saveToStore()
		}
	}

	const saveToStore = () => {
		setSaveToStoreDependency(!saveToStoreDependency)
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
				onChange={saveToStore}
			/>

			<FileUploadField
				label='Song Folders Location'
				placeholder='/Users/Colin/Desktop'
				buttonLabel='Choose Folder'
				filePath={songFoldersLocation}
				onButtonClick={chooseSongFoldersLocation}
				onType={setSongFoldersLocation}
				onChange={saveToStore}
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
					onChange={saveToStore}
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
					onChange={saveToStore}
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

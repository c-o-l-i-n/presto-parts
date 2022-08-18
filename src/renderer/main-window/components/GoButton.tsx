import React, { useContext } from 'react'
import { IpcMainMessage, Payload } from '../../../types'
import IsLoadingContext from '../context/IsLoadingContext'

interface Props {
	ipcMessage: IpcMainMessage
	payload: Payload
}

const GoButton = ({ ipcMessage, payload }: Props) => {
	const { setState: setIsLoading } = useContext(IsLoadingContext)

	const go = async () => {
		setIsLoading(true)
		await window.electron.ipcRenderer.invoke(ipcMessage, payload)
		setIsLoading(false)
	}

	return (
		<div className='field'>
			<button className='button is-primary' onClick={go}>
				Go
			</button>
		</div>
	)
}

export default GoButton

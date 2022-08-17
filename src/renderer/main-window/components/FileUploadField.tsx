import { ipcRenderer } from 'electron'
import React from 'react'
import { IpcMainMessage } from '../../../types'

interface Props {
	label: string
	buttonLabel: string
	placeholder: string
	filePath: string
	ipcMessage: IpcMainMessage
	onType: (text: string) => unknown
}

const FileUploadField = ({
	label,
	buttonLabel,
	placeholder,
	filePath,
	ipcMessage,
	onType,
}: Props) => {
	return (
		<div className='field'>
			<label className='label'>{label}</label>
			<div className='is-flex'>
				<input
					className='input'
					type='text'
					placeholder={placeholder}
					value={filePath}
					onInput={(e) => {
						onType((e.target as HTMLInputElement).value)
					}}
				/>
				<button
					className='button is-primary is-outlined ml-3'
					onClick={() => {
						ipcRenderer.send(ipcMessage)
					}}
				>
					{buttonLabel}
				</button>
			</div>
		</div>
	)
}

export default FileUploadField

import React, { useState } from 'react'
import { Maybe } from '../../../types/types'

interface Props {
	label: string
	buttonLabel: string
	placeholder: string
	filePath: Maybe<string>
	onButtonClick: () => unknown
	onType: (text: string) => unknown
	onChange: () => unknown
}

const FileUploadField = ({
	label,
	buttonLabel,
	placeholder,
	filePath,
	onButtonClick,
	onType,
	onChange,
}: Props) => {
	const [initialFilePath, setInitialFilepath] = useState('')

	return (
		<div className='field'>
			<label className='label'>{label}</label>
			<div className='is-flex'>
				<input
					className='input'
					type='text'
					placeholder={placeholder}
					value={filePath || ''}
					onInput={(e) => {
						onType((e.target as HTMLInputElement).value)
					}}
					onFocus={() => {
						setInitialFilepath(filePath)
					}}
					onBlur={() => {
						if (filePath !== initialFilePath) onChange()
					}}
				/>
				<button
					className='button is-primary is-outlined ml-3'
					onClick={onButtonClick}
				>
					{buttonLabel}
				</button>
			</div>
		</div>
	)
}

export default FileUploadField

import React from 'react'

interface Props {
	label: string
	buttonLabel: string
	placeholder: string
	filePath: string
	onButtonClick: () => unknown
	onType: (text: string) => unknown
}

const FileUploadField = ({
	label,
	buttonLabel,
	placeholder,
	filePath,
	onButtonClick,
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
					onClick={onButtonClick}
				>
					{buttonLabel}
				</button>
			</div>
		</div>
	)
}

export default FileUploadField

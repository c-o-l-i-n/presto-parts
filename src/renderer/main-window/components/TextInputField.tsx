import React from 'react'

interface Props {
	label: string
	placeholder: string
	text: string
	onType: (text: string) => unknown
}

export const TextInputField = ({ label, placeholder, text, onType }: Props) => {
	return (
		<div className='field'>
			<label className='label'>{label}</label>
			<input
				className='input'
				type='text'
				placeholder={placeholder}
				value={text}
				onInput={(e) => {
					onType((e.target as HTMLInputElement).value)
				}}
			/>
		</div>
	)
}

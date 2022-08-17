import React from 'react'

interface Props {
	label: string
	placeholder: string
	text: string
	onType: (text: string) => unknown
}

const TextAreaField = ({ label, placeholder, text, onType }: Props) => {
	return (
		<div className='field'>
			<label className='label'>{label}</label>
			<textarea
				className='textarea'
				cols={30}
				rows={10}
				placeholder={placeholder}
				value={text}
				onInput={(e) => {
					onType((e.target as HTMLTextAreaElement).value)
				}}
			/>
		</div>
	)
}

export default TextAreaField

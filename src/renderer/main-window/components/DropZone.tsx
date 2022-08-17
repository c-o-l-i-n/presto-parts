import React from 'react'

interface Props {
	text: string
}

const DropZone = ({ text }: Props) => {
	return (
		<div id='drop-zone' className='full-screen-overlay'>
			<h1 className='is-size-1 has-text-light has-text-weight-semibold mb-6'>
				{text}
			</h1>
		</div>
	)
}

export default DropZone

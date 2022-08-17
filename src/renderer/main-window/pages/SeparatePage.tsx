import React, { useContext, useState } from 'react'
import { Page } from '../../../types'
import { TextInputField } from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const SeparatePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.SEPARATE
	if (activePage !== thisPage) return

	const [songTitle, setSongTitle] = useState('')

	return (
		<>
			<h1 className='title'>Separate Song Parts</h1>
			<TextInputField
				label='Song Title'
				placeholder='Hey Judy'
				text={songTitle}
				onType={setSongTitle}
			/>
		</>
	)
}

export default SeparatePage

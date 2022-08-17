import React, { useContext, useState } from 'react'
import { Page } from '../../../types'
import { TextInputField } from '../components/TextInputField'
import ActivePageContext from '../context/ActivePageContext'

const GeneratePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.GENERATE
	if (activePage !== thisPage) return

	const [collectionName, setCollectionName] = useState('')

	return (
		<>
			<h1 className='title'>Generate Instrument Parts and Master</h1>
			<TextInputField
				label='Collection Name'
				placeholder='Insect Concert'
				text={collectionName}
				onType={setCollectionName}
			/>
		</>
	)
}

export default GeneratePage

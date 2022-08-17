import React, { useContext } from 'react'
import { Page } from '../../../../src/types'
import ActivePageContext from './context/ActivePageContext'

const GeneratePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.GENERATE

	if (activePage !== thisPage) return

	return <h1 className='title'>Generate Instrument Parts and Master</h1>
}

export default GeneratePage

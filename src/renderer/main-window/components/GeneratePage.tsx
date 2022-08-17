import React, { useContext } from 'react'
import { Page } from '../../../../src/types'
import ActivePageContext from './context/ActivePageContext'

const GeneratePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.GENERATE

	if (activePage !== thisPage) return

	return <div>Generate</div>
}

export default GeneratePage

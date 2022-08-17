import React, { useContext } from 'react'
import { Page } from '../../../../src/types'
import ActivePageContext from './context/ActivePageContext'

const SeparatePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.SEPARATE

	if (activePage !== thisPage) return

	return <div>SeparateSongParts</div>
}

export default SeparatePage

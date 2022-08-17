import React, { useContext } from 'react'
import { Page } from '../../../types'
import ActivePageContext from '../context/ActivePageContext'

const SeparatePage = () => {
	const { activePage } = useContext(ActivePageContext)
	const thisPage = Page.SEPARATE

	if (activePage !== thisPage) return

	return <h1 className='title'>Separate Song Parts</h1>
}

export default SeparatePage

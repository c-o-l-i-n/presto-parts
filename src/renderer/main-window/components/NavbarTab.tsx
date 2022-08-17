import React, { useContext } from 'react'
import { Tab } from '../../../../src/types'
import ActivePageContext from '../context/ActivePageContext'

interface Props {
	tab: Tab
}

const NavbarTab = ({ tab }: Props) => {
	const { activePage, setActivePage } = useContext(ActivePageContext)

	return (
		<li className={activePage === tab.page ? 'is-active' : undefined}>
			<a onClick={() => setActivePage(tab.page)}>
				<span className='icon'>
					<div
						className='pp-icon'
						style={{
							WebkitMaskImage: `url(${tab.icon})`,
						}}
					></div>
				</span>
				<span>{tab.text}</span>
			</a>
		</li>
	)
}

export default NavbarTab

import React from 'react'
import { Tab } from '../../../types'
import NavbarTab from './NavbarTab'

interface Props {
	tabs: Tab[]
}

const Navbar = ({ tabs }: Props) => {
	const tabComponents = tabs.map((tab, index) => (
		<NavbarTab tab={tab} key={index} />
	))

	return (
		<nav id='navbar' className='tabs is-centered'>
			<ul>{tabComponents}</ul>
		</nav>
	)
}

export default Navbar

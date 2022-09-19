import React, { ReactElement, useContext } from 'react'
import { Tab } from '../../../types/types'
import ActivePageContext from '../context/ActivePageContext'

interface Props {
  tab: Tab
}

const NavbarTab = ({ tab }: Props): ReactElement => {
  const { state: activePage, setState: setActivePage } = useContext(ActivePageContext)

  return (
    <li className={activePage === tab.page ? 'is-active' : undefined} role='tab'>
      <a onClick={() => setActivePage(tab.page)} role='link'>
        <span className='icon'>
          <div
            className='pp-icon'
            style={{ WebkitMaskImage: `url(${tab.icon})` }}
          />
        </span>
        <span>{tab.page}</span>
      </a>
    </li>
  )
}

export default NavbarTab

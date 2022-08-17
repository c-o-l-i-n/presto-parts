import React from 'react'
import Navbar from './components/Navbar'
import CutIcon from '../../../assets/images/cut.svg'
import SheetMusicIcon from '../../../assets/images/sheet-music.svg'
import { Page, Tab } from '../../types'
import { ActivePageProvider } from './context/ActivePageContext'
import SeparatePage from './pages/SeparatePage'
import GeneratePage from './pages/GeneratePage'

const tabs: Tab[] = [
	{
		page: Page.SEPARATE,
		text: 'Separate Song Parts',
		icon: CutIcon,
	},
	{
		page: Page.GENERATE,
		text: 'Generate Instrument Parts and Master',
		icon: SheetMusicIcon,
	},
]

const MainWindow = () => {
	return (
		<ActivePageProvider>
			<Navbar tabs={tabs} />
			<main id='main' className='section'>
				<SeparatePage />
				<GeneratePage />
			</main>
		</ActivePageProvider>
	)
}

export default MainWindow

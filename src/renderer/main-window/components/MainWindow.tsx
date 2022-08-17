import React from 'react'
import Navbar from './Navbar'
import CutIcon from '../../../../assets/images/cut.svg'
import SheetMusicIcon from '../../../../assets/images/sheet-music.svg'
import { Page, Tab } from '../../../../src/types'
import { ActivePageProvider } from './context/ActivePageContext'
import SeparatePage from './SeparatePage'
import GeneratePage from './GeneratePage'

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
			<SeparatePage />
			<GeneratePage />
		</ActivePageProvider>
	)
}

export default MainWindow

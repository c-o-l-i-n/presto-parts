import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import CutIcon from '../../../assets/images/cut.svg'
import SheetMusicIcon from '../../../assets/images/sheet-music.svg'
import { Page, Tab } from '../../types/types'
import SeparatePage from './pages/SeparatePage'
import GeneratePage from './pages/GeneratePage'
import Loader from './components/Loader'
import IsLoadingContext from './context/IsLoadingContext'

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
	const { state: isLoading } = useContext(IsLoadingContext)

	return (
		<>
			{isLoading ? <Loader /> : null}
			<Navbar tabs={tabs} />
			<main id='main' className='section'>
				<SeparatePage />
				<GeneratePage />
			</main>
		</>
	)
}

export default MainWindow

import React, { ReactElement, useContext } from 'react'
import Navbar from './components/Navbar'
import CutIcon from '../../../assets/images/cut.svg'
import SheetMusicIcon from '../../../assets/images/sheet-music.svg'
import { AppData, Page, Tab } from '../../types/types'
import SeparatePage from './pages/SeparatePage'
import GeneratePage from './pages/GeneratePage'
import Loader from './components/Loader'
import IsLoadingContext from './context/IsLoadingContext'

const tabs: Tab[] = [
  {
    page: Page.SEPARATE,
    icon: CutIcon
  },
  {
    page: Page.GENERATE,
    icon: SheetMusicIcon
  }
]

interface Props {
  appData: AppData
}

const MainWindow = ({ appData }: Props): ReactElement => {
  const { state: isLoading } = useContext(IsLoadingContext)

  return (
    <>
      {isLoading ? <Loader /> : null}
      <Navbar tabs={tabs} />
      <main id='main' className='section'>
        <SeparatePage
          songTitle={appData.songTitle}
          pdfSourcePath={appData.pdfSourcePath}
          partsList={appData.partsList}
        />
        <GeneratePage
          collectionName={appData.collectionName}
          songFoldersLocation={appData.songFoldersLocation}
          songList={appData.songList}
          instrumentPartsList={appData.instrumentPartsList}
        />
      </main>
    </>
  )
}

export default MainWindow

/* istanbul ignore file */

import React from 'react'
import { createRoot } from 'react-dom/client'
import { IsLoadingProvider } from './context/IsLoadingContext'
import { ActivePageProvider } from './context/ActivePageContext'
import MainWindow from './MainWindow'
import '../common/style.scss'

const el = document.getElementById('root')
if (el === null) throw new Error('Root container missing in index.html')

const root = createRoot(el)

void window.electron.getAppData().then((appData) =>
  root.render(
    <React.StrictMode>
      <IsLoadingProvider>
        <ActivePageProvider>
          <MainWindow appData={appData} />
        </ActivePageProvider>
      </IsLoadingProvider>
    </React.StrictMode>
  )
)

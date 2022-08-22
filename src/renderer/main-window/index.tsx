import React from 'react'
import ReactDOM from 'react-dom/client'
import { IsLoadingProvider } from './context/IsLoadingContext'
import { ActivePageProvider } from './context/ActivePageContext'
import MainWindow from './MainWindow'
import '../common/style.scss'

const el = document.getElementById('root')
if (el === null) throw new Error('Root container missing in index.html')

const root = ReactDOM.createRoot(el)

window.electron.getAppData().then((appData) =>
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

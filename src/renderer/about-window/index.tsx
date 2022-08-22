import React from 'react'
import ReactDOM from 'react-dom/client'
import AboutWindow from './AboutWindow'
import '../common/style.scss'

const el = document.getElementById('root')
if (el === null) throw new Error('Root container missing in index.html')

const root = ReactDOM.createRoot(el)

window.electron.getAppInfo().then((appInfo) =>
	root.render(
		<React.StrictMode>
			<AboutWindow appInfo={appInfo} />
		</React.StrictMode>
	)
)

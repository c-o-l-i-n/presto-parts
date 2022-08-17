import React from 'react'
import ReactDOM from 'react-dom/client'
import MainWindow from './components/MainWindow'
import '../common/style.scss'

const el = document.getElementById('root')
if (el === null) throw new Error('Root container missing in index.html')

const root = ReactDOM.createRoot(el)
root.render(
	<React.StrictMode>
		<MainWindow />
	</React.StrictMode>
)

import React from 'react'
import { createRoot } from 'react-dom/client'
import AboutWindow from './AboutWindow'
import '../common/style.scss'

const el = document.getElementById('root')
if (el === null) throw new Error('Root container missing in index.html')

const root = createRoot(el)

void window.electron.getAppInfo().then((appInfo) =>
  root.render(
    <React.StrictMode>
      <AboutWindow appInfo={appInfo} />
    </React.StrictMode>
  )
)

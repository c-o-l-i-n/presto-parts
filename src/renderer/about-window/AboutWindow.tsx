import React from 'react'
import { AppInfo, ExternalSite } from '../../types/types'
import Logo from '../../../assets/app-icons/app-icon.iconset/icon_128x128.png'
import ExternalLink from './components/ExternalLink'

interface Props {
  appInfo: AppInfo
}

const AboutWindow = ({ appInfo }: Props): JSX.Element => {
  document.title = `About ${appInfo.name}`

  return (
    <main className='hero is-fullheight has-text-centered is-flex is-flex-direction-column is-justify-content-center is-align-items-center pb-2'>
      <img src={Logo} alt='Presto Parts Icon' className='image is-64x64' />
      <p className='is-size-5 has-text-weight-bold'>{appInfo.name}</p>
      <p className='is-size-7'>{appInfo.version}</p>
      <p className='mt-3'>Orangize your sheet music by part</p>
      <p className='mt-2'>
        <ExternalLink url={ExternalSite.APP_WEBSITE}>Website</ExternalLink>
      </p>
      <p className='is-size-7 mt-3'>
        Navbar icons by{' '}
        <ExternalLink url={ExternalSite.ICONS_8}>icons8</ExternalLink>
      </p>
      <p className='is-size-7 mt-2'>Copyright &copy; 2022 Colin A. Williams</p>
    </main>
  )
}

export default AboutWindow

import React, { ReactElement } from 'react'
import { ExternalSite } from '../../../types/types'

interface Props {
  children: React.ReactNode
  url: ExternalSite
}

const ExternalLink = ({ children, url }: Props): ReactElement => {
  return <a onClick={() => window.electron.openExternal(url)}>{children}</a>
}

export default ExternalLink

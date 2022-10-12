import React, { createContext, ReactElement, useState } from 'react'
import { Page, Context } from '../../../types/types'
import { noop } from '../utils'

const initialActivePage = Page.SEPARATE

const ActivePageContext = createContext<Context<Page>>({
  state: initialActivePage,
  setState: noop
})

interface Props {
  children: React.ReactNode
}
const ActivePageProvider = ({ children }: Props): ReactElement => {
  const [activePage, setActivePage] = useState<Page>(initialActivePage)

  return (
    <ActivePageContext.Provider
      value={{
        state: activePage,
        setState: (page) => setActivePage(page)
      }}
    >
      {children}
    </ActivePageContext.Provider>
  )
}

export default ActivePageContext
export { ActivePageProvider }

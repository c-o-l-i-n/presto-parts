import React, { createContext, useState } from 'react'
import { Page, ActivePageContextType } from '../../../types'

const initialActivePage = Page.SEPARATE

const ActivePageContext = createContext<ActivePageContextType>({
	activePage: initialActivePage,
})

interface Props {
	children: React.ReactNode
}
const ActivePageProvider = ({ children }: Props) => {
	const [activePage, setActivePage] = useState<Page>(initialActivePage)

	return (
		<ActivePageContext.Provider
			value={{
				activePage: activePage,
				setActivePage: (page) => setActivePage(page),
			}}
		>
			{children}
		</ActivePageContext.Provider>
	)
}

export default ActivePageContext
export { ActivePageProvider }

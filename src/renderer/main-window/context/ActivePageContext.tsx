import React, { createContext, useState } from 'react'
import { Page, Context } from '../../../types'

const initialActivePage = Page.SEPARATE

const ActivePageContext = createContext<Context<Page>>({
	state: initialActivePage,
})

interface Props {
	children: React.ReactNode
}
const ActivePageProvider = ({ children }: Props) => {
	const [activePage, setActivePage] = useState<Page>(initialActivePage)

	return (
		<ActivePageContext.Provider
			value={{
				state: activePage,
				setState: (page) => setActivePage(page),
			}}
		>
			{children}
		</ActivePageContext.Provider>
	)
}

export default ActivePageContext
export { ActivePageProvider }

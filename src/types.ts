enum Page {
	SEPARATE,
	GENERATE,
}

interface ActivePageContextType {
	activePage: Page
	setActivePage?: (page: Page) => void
}

interface Tab {
	text: string
	icon: string
	page: Page
}

export { Page, ActivePageContextType, Tab }

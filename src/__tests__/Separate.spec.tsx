import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { cleanup, render, RenderResult, screen } from '@testing-library/react'
import {
	emptyRenderBaseElement,
	mockAppData,
	mockChangeValue,
	mockElectronApi,
} from './mocks'
import SeparatePage from '../renderer/main-window/pages/SeparatePage'
import { AppData, Page } from '../types/types'
import ActivePageContext from '../renderer/main-window/context/ActivePageContext'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'

describe('SeparatePage', () => {
	const pageTitle = 'Separate Song Parts'
	const dataFields: Record<string, keyof AppData> = {
		'Song Title': 'songTitle',
		'PDF Source': 'pdfSourcePath',
		'Parts List': 'partsList',
	}
	window.electron = mockElectronApi

	let component: ReactElement
	let renderResult: RenderResult
	let user: UserEvent
	let saveToStoreSpy: jest.SpyInstance

	beforeEach(() => {
		component = (
			<SeparatePage
				songTitle={mockAppData.songTitle}
				pdfSourcePath={mockAppData.pdfSourcePath}
				partsList={mockAppData.partsList}
			/>
		)
		renderResult = render(component)
		user = userEvent.setup()
		saveToStoreSpy = jest.spyOn(window.electron, 'saveToStore')
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	it('should render', () => {
		expect(renderResult).toBeTruthy()
	})

	it('should not render when page not active', () => {
		cleanup()
		const result = render(
			<ActivePageContext.Provider value={{ state: Page.GENERATE }}>
				{component}
			</ActivePageContext.Provider>
		)
		expect(result.baseElement).toEqual(emptyRenderBaseElement)
	})

	it('should have heading with page title', () => {
		const heading = screen.queryByRole('heading')
		expect(heading).toHaveTextContent(pageTitle)
	})

	Object.keys(dataFields).forEach((fieldLabel) =>
		it(`should have "${fieldLabel}" label`, () => {
			const label = screen.queryByText(fieldLabel)
			expect(label).toBeInTheDocument()
		})
	)

	Object.keys(dataFields).forEach((fieldLabel) =>
		it(`should have "${fieldLabel}" field`, () => {
			const field = screen.queryByLabelText(fieldLabel)
			expect(field).toBeInTheDocument()
		})
	)

	Object.entries(dataFields).forEach(([fieldLabel, data]) =>
		it(`should populate "${fieldLabel}" field with ${data} data`, () => {
			const field: HTMLInputElement | HTMLTextAreaElement =
				screen.queryByLabelText(fieldLabel)
			expect(field.value).toEqual(mockAppData[data])
		})
	)

	describe('when given no initial app data', () => {
		beforeEach(() => {
			cleanup()
			component = (
				<SeparatePage
					songTitle={undefined}
					pdfSourcePath={undefined}
					partsList={undefined}
				/>
			)
			renderResult = render(component)
		})

		Object.keys(dataFields).forEach((fieldLabel) =>
			it(`should populate "${fieldLabel}" field with an empty string`, () => {
				const field: HTMLInputElement | HTMLTextAreaElement =
					screen.queryByLabelText(fieldLabel)
				expect(field.value).toEqual('')
			})
		)
	})

	it('should have "Choose PDF" button', () => {
		const chooseFileButton = screen.queryByText('Choose File', {
			selector: 'button',
		})
		expect(chooseFileButton).toBeInTheDocument()
	})

	it('should have go button', () => {
		const goButton = screen.queryByText('Go', { selector: 'button' })
		expect(goButton).toBeInTheDocument()
	})

	describe('after choosing a file with the "Choose File" button', () => {
		let pdfSourceField: HTMLInputElement
		let chooseFileButton: HTMLButtonElement

		beforeEach(async () => {
			pdfSourceField = screen.getByLabelText('PDF Source')
			chooseFileButton = screen.getByText('Choose File', {
				selector: 'button',
			})
			await user.click(chooseFileButton)
		})

		it('should populate the "PDF Source" field with the new value', async () => {
			expect(pdfSourceField.value).toEqual(mockChangeValue)
		})

		it('should save data to the store', async () => {
			expect(saveToStoreSpy).toHaveBeenCalledTimes(1)
		})
	})

	Object.keys(dataFields).forEach((fieldLabel) =>
		describe(`after editing the "${fieldLabel}" field`, () => {
			let field: HTMLInputElement | HTMLTextAreaElement

			beforeEach(async () => {
				field = screen.getByLabelText(fieldLabel)
				await user.clear(field)
				await user.type(field, mockChangeValue, { skipClick: true })
				await user.tab()
			})

			it(`should populate the "${fieldLabel}"" field with the new value`, async () => {
				expect(field.value).toEqual(mockChangeValue)
			})

			it(`should save data to store`, () => {
				expect(saveToStoreSpy).toHaveBeenCalledTimes(1)
			})
		})
	)
})

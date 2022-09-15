import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { cleanup, render, RenderResult, screen } from '@testing-library/react'
import { emptyRenderBaseElement, mockAppData, mockChangeValue, mockElectronApi, noop } from './mocks'
import GeneratePage from '../renderer/main-window/pages/GeneratePage'
import { AppData, Page } from '../types/types'
import ActivePageContext from '../renderer/main-window/context/ActivePageContext'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'

describe('GeneratePage', () => {
  const pageTitle = 'Generate Instrument Parts and Master'
  const dataFields: Record<string, keyof AppData> = {
    'Collection Name': 'collectionName',
    'Song Folders Location': 'songFoldersLocation',
    'Song List': 'songList',
    'Instrument Parts List': 'instrumentPartsList'
  }
  window.electron = mockElectronApi

  let component: ReactElement
  let renderResult: RenderResult
  let user: UserEvent
  let saveToStoreSpy: jest.SpyInstance

  beforeEach(() => {
    component = (
      <GeneratePage
        collectionName={mockAppData.collectionName}
        songFoldersLocation={mockAppData.songFoldersLocation}
        songList={mockAppData.songList}
        instrumentPartsList={mockAppData.instrumentPartsList}
      />
    )
    renderResult = render(
      <ActivePageContext.Provider value={{ state: Page.GENERATE, setState: noop }}>
        {component}
      </ActivePageContext.Provider>
    )
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
      <ActivePageContext.Provider value={{ state: Page.SEPARATE, setState: noop }}>
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
      const field: HTMLInputElement | HTMLTextAreaElement = screen.getByLabelText(fieldLabel)
      expect(field.value).toEqual(mockAppData[data])
    })
  )

  describe('when given no initial app data', () => {
    beforeEach(() => {
      cleanup()
      component = (
        // @ts-expect-error
        <GeneratePage />
      )
      renderResult = render(
        <ActivePageContext.Provider value={{ state: Page.GENERATE, setState: noop }}>
          {component}
        </ActivePageContext.Provider>
      )
    })

    Object.keys(dataFields).forEach((fieldLabel) =>
      it(`should populate "${fieldLabel}" field with an empty string`, () => {
        const field: HTMLInputElement | HTMLTextAreaElement = screen.getByLabelText(fieldLabel)
        expect(field.value).toEqual('')
      })
    )
  })

  it('should have "Choose Folder" button', () => {
    const chooseFileButton = screen.queryByText('Choose Folder', { selector: 'button' })
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
      pdfSourceField = screen.getByLabelText('Song Folders Location')
      chooseFileButton = screen.getByText('Choose Folder', { selector: 'button' })
      await user.click(chooseFileButton)
    })

    it('should populate the "Song Folders Location" field with the new value', async () => {
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

      it('should save data to store', () => {
        expect(saveToStoreSpy).toHaveBeenCalledTimes(1)
      })
    })
  )
})

import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { getByRole, queryByText, render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MainWindow from '../renderer/main-window/MainWindow'
import { mockAppData, noop } from './mocks'
import IsLoadingContext from '../renderer/main-window/context/IsLoadingContext'
import { Page } from '../types/types'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import { ActivePageProvider } from '../renderer/main-window/context/ActivePageContext'

describe('MainWindow', () => {
  let component: ReactElement
  let componentRender: RenderResult
  let user: UserEvent

  beforeEach(() => {
    component = <MainWindow appData={mockAppData} />
    componentRender = render(
      <ActivePageProvider>
        <MainWindow appData={mockAppData} />
      </ActivePageProvider>
    )
    user = userEvent.setup()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(componentRender).toBeTruthy()
  })

  it('should show loader when loading', () => {
    render(
      <IsLoadingContext.Provider value={{ state: true, setState: noop }}>
        {component}
      </IsLoadingContext.Provider>
    )
    const loader = screen.queryByTestId('loader')
    expect(loader).toBeInTheDocument()
  })

  it('should not show loader when not loading', () => {
    const loader = screen.queryByTestId('loader')
    expect(loader).not.toBeInTheDocument()
  })

  it('should initially show "separate" page (have "separate" heading)', () => {
    const heading = screen.queryByRole('heading')
    expect(heading).toHaveTextContent(Page.SEPARATE)
  })

  describe('tabs', () => {
    let tabs: HTMLElement[]
    let separateTab: HTMLElement
    let generateTab: HTMLElement

    beforeEach(() => {
      tabs = screen.queryAllByRole('tab')

      const separateTabFound = tabs.find((tab) => queryByText(tab, Page.SEPARATE))
      const generateTabFound = tabs.find((tab) => queryByText(tab, Page.GENERATE))

      if (separateTabFound === undefined) {
        fail('Separate tab not found')
      } else {
        separateTab = separateTabFound
      }

      if (generateTabFound === undefined) {
        fail('Generate tab not found')
      } else {
        generateTab = generateTabFound
      }
    })

    it('should have a tab for each page', () => {
      const pages = Object.values(Page)

      // same number of pages and tabs
      expect(tabs.length).toEqual(pages.length)

      // each page has a tab
      pages.forEach((page) => {
        const tab = tabs.find((tab) => queryByText(tab, page))
        expect(tab).toBeInTheDocument()
      })
    })

    it('should initially have the "separate" tab active', () => {
      expect(separateTab).toHaveClass('is-active')
      expect(generateTab).not.toHaveClass('is-active')
    })

    describe('after clicking "generate" tab', () => {
      let generateTabLink: HTMLElement

      beforeEach(async () => {
        generateTabLink = getByRole(generateTab, 'link')
        await user.click(generateTabLink)
      })

      it('should have "generate" tab active', () => {
        expect(separateTab).not.toHaveClass('is-active')
        expect(generateTab).toHaveClass('is-active')
      })

      it('should show "generate" page (have "generate" heading)', () => {
        const heading = screen.queryByRole('heading')
        expect(heading).toHaveTextContent(Page.GENERATE)
      })

      describe('after clicking "separate" tab', () => {
        let separateTabLink: HTMLElement

        beforeEach(async () => {
          separateTabLink = getByRole(separateTab, 'link')
          await user.click(separateTabLink)
        })

        it('should have "separate" tab active', () => {
          expect(separateTab).toHaveClass('is-active')
          expect(generateTab).not.toHaveClass('is-active')
        })

        it('should show "separate" page (have "separate" heading)', () => {
          const heading = screen.queryByRole('heading')
          expect(heading).toHaveTextContent(Page.SEPARATE)
        })
      })
    })
  })
})

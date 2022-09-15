import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { queryByText, render, RenderResult, screen } from '@testing-library/react'
import MainWindow from '../renderer/main-window/MainWindow'
import { mockAppData, noop } from './mocks'
import IsLoadingContext from '../renderer/main-window/context/IsLoadingContext'
import { Page } from '../types/types'

describe('MainWindow', () => {
  let component: ReactElement
  let componentRender: RenderResult

  beforeEach(() => {
    component = <MainWindow appData={mockAppData} />
    componentRender = render(component)
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

  it('should have a tab for each page', () => {
    const pages = Object.values(Page)
    const tabs = screen.queryAllByRole('tab')

    // same number of pages and tabs
    expect(tabs.length).toEqual(pages.length)

    // each page has a tab
    pages.forEach((page) => {
      const tab = tabs.find((tab) => queryByText(tab, page))
      expect(tab).toBeInTheDocument()
    })
  })
})

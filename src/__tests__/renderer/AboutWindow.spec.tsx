import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render, RenderResult, screen } from '@testing-library/react'
import { mockAppInfo, mockAppName, mockAppVersion } from './mocks'
import AboutWindow from '../../renderer/about-window/AboutWindow'

describe('AboutWindow', () => {
  let component: ReactElement
  let componentRender: RenderResult

  beforeEach(() => {
    component = <AboutWindow appInfo={mockAppInfo} />
    componentRender = render(component)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(componentRender).toBeTruthy()
  })

  it('should show app name', () => {
    expect(screen.queryAllByText(mockAppName))
  })

  it('should show app version', () => {
    expect(screen.queryAllByText(mockAppVersion))
  })
})

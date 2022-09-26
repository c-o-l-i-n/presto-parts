import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render, RenderResult, screen } from '@testing-library/react'
import { mockElectronApi } from './mocks'
import { ExternalSite } from '../../types/types'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import ExternalLink from '../../renderer/about-window/components/ExternalLink'

describe('ExternalLink', () => {
  window.electron = mockElectronApi

  let component: ReactElement
  let renderResult: RenderResult
  let user: UserEvent
  let openExternalSpy: jest.SpyInstance
  let element: HTMLElement
  let externalSite: ExternalSite

  beforeEach(() => {
    externalSite = ExternalSite.APP_WEBSITE
    component = <ExternalLink url={externalSite}>Click me</ExternalLink>
    renderResult = render(component)
    user = userEvent.setup()
    openExternalSpy = jest.spyOn(window.electron, 'openExternal')
    element = screen.getByRole('link')
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

  it('should run ipc "openExternal" when clicked', async () => {
    await user.click(element)
    expect(openExternalSpy).toHaveBeenCalledTimes(1)
    expect(openExternalSpy).toHaveBeenCalledWith(externalSite)
  })
})

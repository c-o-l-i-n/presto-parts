import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render, RenderResult, screen } from '@testing-library/react'
import { mockElectronApi, mockSeparatePaylod } from './mocks'
import { IpcMainMessage, Payload } from '../types/types'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import GoButton from '../renderer/main-window/components/GoButton'
import { IsLoadingProvider } from '../renderer/main-window/context/IsLoadingContext'

describe('GoButton', () => {
  window.electron = mockElectronApi

  let ipcMessage: IpcMainMessage
  let payload: Payload
  let component: ReactElement
  let renderResult: RenderResult
  let user: UserEvent
  let invokeSpy: jest.SpyInstance
  let element: HTMLElement

  beforeEach(() => {
    ipcMessage = IpcMainMessage.SEPARATE
    payload = mockSeparatePaylod
    component = <GoButton ipcMessage={ipcMessage} payload={payload} />
    renderResult = render(
      <IsLoadingProvider>
        {component}
      </IsLoadingProvider>
    )
    user = userEvent.setup()
    invokeSpy = jest.spyOn(window.electron, 'invoke')
    element = screen.getByRole('button')
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

  it('should invoke ipc message with payload when clicked', async () => {
    await user.click(element)
    expect(invokeSpy).toHaveBeenCalledTimes(1)
    expect(invokeSpy).toHaveBeenCalledWith(ipcMessage, payload)
  })
})

import React, { ReactElement, useContext } from 'react'
import { IpcMainMessage, Payload } from '../../../types/types'
import IsLoadingContext from '../context/IsLoadingContext'

interface Props {
  ipcMessage: IpcMainMessage
  payload: Payload
}

const GoButton = ({ ipcMessage, payload }: Props): ReactElement => {
  const { setState: setIsLoading } = useContext(IsLoadingContext)

  const go = async (): Promise<void> => {
    setIsLoading(true)
    await window.electron.invoke(ipcMessage, payload)
    setIsLoading(false)
  }

  return (
    <div className='field'>
      <button className='button is-primary' onClick={go}>
        Go
      </button>
    </div>
  )
}

export default GoButton

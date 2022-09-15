/* istanbul ignore file */

import { render } from '@testing-library/react'
import React from 'react'
import { AppData, AppInfo, ElectronApi } from '../types/types'

export const mockAppData: AppData = {
  songTitle: 'Mock Song Title',
  pdfSourcePath: 'Mock PDF Source Path',
  partsList: 'Mock Parts List',
  collectionName: 'Mock Collection Name',
  songFoldersLocation: 'Mock Song Folders Location',
  songList: 'Mock Song List',
  instrumentPartsList: 'Mock Instrument Parts Lists'
}

export const mockAppInfo: AppInfo = {
  name: 'Mock App Name',
  version: 'Mock App Version'
}

export const mockChangeValue = 'change'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {}

export const mockElectronApi: ElectronApi = {
  invoke: async (): Promise<string> => await Promise.resolve(mockChangeValue),
  getAppInfo: async (): Promise<AppInfo> => await Promise.resolve(mockAppInfo),
  openExternal: noop,
  showMessageBox: noop,
  fileIsDirectory: async (): Promise<boolean> => {
    throw new Error('You should mock implement this function.')
  },
  getFileExtension: async (): Promise<string> => {
    throw new Error('You should mock implement this function.')
  },
  getAppData: async (): Promise<AppData> => await Promise.resolve(mockAppData),
  saveToStore: noop
}

export const emptyRenderBaseElement = render(<></>).baseElement

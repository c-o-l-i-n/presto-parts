/* istanbul ignore file */

import { render } from '@testing-library/react'
import React from 'react'
import { AppData, AppInfo, ElectronApi, GeneratePayload, Page, SeparatePayload, Tab } from '../types/types'

export const mockSeparatePaylod: SeparatePayload = {
  songTitle: 'Mock Song Title',
  pdfSourcePath: 'Mock PDF Source Path',
  partsList: 'Mock Parts List'
}

export const mockGeneratePaylod: GeneratePayload = {
  collectionName: 'Mock Collection Name',
  songFoldersLocation: 'Mock Song Folders Location',
  songList: 'Mock Song List',
  instrumentPartsList: 'Mock Instrument Parts Lists'
}

export const mockAppData: AppData = {
  ...mockSeparatePaylod,
  ...mockGeneratePaylod
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

export const mockTab: Tab = { page: Page.GENERATE, icon: 'mock/icon/path' }

export const mockPdfFile = { ...new File(['Mock PDF File'], 'MockPdfFile.pdf', { type: 'application/pdf' }), path: '/path/to/MockPdfFile.pdf' }
export const mockTxtFile = { ...new File(['Mock TXT File'], 'MockTxtFile.txt', { type: 'text/plain' }), path: '/path/to/MockTxtFile.txt' }
export const mockDirectory = { ...new File(['Mock Directory'], 'MockDirectory', {}), path: '/path/to/MockDirectory' }
export const mockFileWithNoType = { ...new File(['Mock File With No Type'], 'MockFileWithNoTYpe', {}), path: '/path/to/MockFileWithNoTYpe' }

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
	instrumentPartsList: 'Mock Instrument Parts Lists',
}

export const mockAppInfo: AppInfo = {
	name: 'Mock App Name',
	version: 'Mock App Version',
}

export const mockChangeValue = 'change'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}

export const mockElectronApi: ElectronApi = {
	invoke: (): Promise<string> => Promise.resolve(mockChangeValue),
	getAppInfo: (): Promise<AppInfo> => Promise.resolve(mockAppInfo),
	openExternal: noop,
	showMessageBox: noop,
	fileIsDirectory: (): Promise<boolean> => {
		throw new Error('You should mock implement this function.')
	},
	getFileExtension: (): Promise<string> => {
		throw new Error('You should mock implement this function.')
	},
	getAppData: (): Promise<AppData> => Promise.resolve(mockAppData),
	saveToStore: noop,
}

export const emptyRenderBaseElement = render(<></>).baseElement

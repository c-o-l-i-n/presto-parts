/* istanbul ignore file */

import { render } from '@testing-library/react'
import React from 'react'
import {
	AppData,
	AppInfo,
	ElectronApi,
	ExternalSite,
	IpcMainMessage,
	MessageBoxType,
	Payload,
} from '../types/types'

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

export const mockElectronApi: ElectronApi = {
	invoke: (channel: IpcMainMessage, payload?: Payload): Promise<string> =>
		Promise.resolve(mockChangeValue),

	getAppInfo: (): Promise<AppInfo> => Promise.resolve(mockAppInfo),

	openExternal: (url: ExternalSite): void => {
		return
	},

	showMessageBox: (type: MessageBoxType, text: string): void => {
		return
	},

	fileIsDirectory: (filePath: string): Promise<boolean> => {
		throw new Error('You should mock implement this function.')
	},

	getFileExtension: (filePath: string): Promise<string> => {
		throw new Error('You should mock implement this function.')
	},

	getAppData: (): Promise<AppData> => Promise.resolve(mockAppData),

	saveToStore: (payload: Payload): void => {
		return
	},
}

export const emptyRenderBaseElement = render(<></>).baseElement

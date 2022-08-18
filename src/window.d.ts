import { ElectronApi } from './types'

export declare global {
	interface Window {
		electron: ElectronApi
	}
}

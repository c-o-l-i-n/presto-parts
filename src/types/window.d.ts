import { ElectronApi } from '../types/types'

export declare global {
	interface Window {
		electron: ElectronApi
	}
}

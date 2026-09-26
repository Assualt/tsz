import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  openNewWindow: () => void
  ping: () => void
  getLoginState: () => void
  sendLoginState: (targetId: number, loginData: any) => void
  onSyncLoginState: (callback: () => void) => void
  onRequestLoginState: (callback: (event: any, targetId: number) => void) => void
  onReceiveLoginState: (callback: (event: any, loginData: any) => void) => void
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

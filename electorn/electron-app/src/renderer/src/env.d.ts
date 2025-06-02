/// <reference types="vite/client" />

interface Window {
  api: {
    getLoginState: () => Promise<any>
    sendLoginState: (targetId: number, loginData: any) => void
    openNewWindow: () => Promise<boolean>
    logout: () => Promise<any>
    ping: () => Promise<any>
    onSyncLoginState: (callback: () => void) => () => void
    onRequestLoginState: (callback: (event: any, targetId: number) => void) => () => void
    onReceiveLoginState: (callback: (event: any, loginData: any) => void) => () => void
    removeAllListeners: (channel: string) => void
  }
  electron: {
    ipcRenderer: {
      send: (channel: string, ...args: any[]) => void
    }
  }
}

export {}

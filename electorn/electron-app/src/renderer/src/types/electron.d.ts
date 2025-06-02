import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcRendererEvent } from 'electron'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // 基础方法
      ping: () => Promise<string>
      openNewWindow: () => Promise<boolean>

      // 登录状态相关
      getLoginState: () => Promise<boolean>
      sendLoginState: (targetId: number, loginData: any) => void

      // 事件监听器及其清理函数
      onSyncLoginState: (callback: () => void) => () => void
      onRequestLoginState: (
        callback: (event: IpcRendererEvent, targetId: number) => void
      ) => () => void
      onReceiveLoginState: (
        callback: (event: IpcRendererEvent, loginData: any) => void
      ) => () => void

      // 清理监听器
      removeAllListeners: (channel: string) => void
    }
  }
}

export {}

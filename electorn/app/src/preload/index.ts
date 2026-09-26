import { contextBridge, ipcRenderer } from 'electron'
const api = {
  // 同步方法
  getLoginState: () => ipcRenderer.invoke('get-login-state'),
  sendLoginState: (targetId: number, loginData: any) =>
    ipcRenderer.send('send-login-state', targetId, loginData),
  openNewWindow: async (): Promise<boolean> => {
    try {
      return await ipcRenderer.invoke('open-new-window')
    } catch (error) {
      console.error('Failed to open new window:', error)
      throw new Error('打开新窗口失败，请稍后重试')
    }
  },
  logout: () => ipcRenderer.invoke('logout'),
  ping: () => ipcRenderer.invoke('ping'),

  // 事件监听器
  onSyncLoginState: (callback: () => void) => {
    const listener = (_event: any, ...args: any[]) => callback(...args)
    ipcRenderer.on('sync-login-state', listener)
    return () => ipcRenderer.removeListener('sync-login-state', listener)
  },

  onRequestLoginState: (callback: (event: any, targetId: number) => void) => {
    const listener = (_event: any, ...args: any[]) => callback(_event, ...args)
    ipcRenderer.on('request-login-state', listener)
    return () => ipcRenderer.removeListener('request-login-state', listener)
  },

  onReceiveLoginState: (callback: (event: any, loginData: any) => void) => {
    const listener = (_event: any, ...args: any[]) => callback(_event, ...args)
    ipcRenderer.on('receive-login-state', listener)
    return () => ipcRenderer.removeListener('receive-login-state', listener)
  },

  // 清理监听器
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
}

// 通过 contextBridge 暴露 API
contextBridge.exposeInMainWorld('api', api)

export type API = typeof api

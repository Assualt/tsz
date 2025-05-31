import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 存储所有窗口实例
const all_windows = new Map()
let loginData = null
function createWindowConfig(options = {}) {
  return {
    width: 600,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    },
    resizable: true,
    ...options
  }
}

async function loadWindowContent(window: BrowserWindow) {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    await window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    await window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function closeAllChildWindows() {
  for (const [id, win] of all_windows) {
    if (!win.isDestroyed()) {
      win.close()
    }
  }
}

function createWindow(): void {
  const mainWindow = new BrowserWindow(createWindowConfig())
  all_windows.set(mainWindow.id, mainWindow)
  mainWindow.setTitle('12306 抢票助手')
  
  mainWindow.on('closed', () => {
    all_windows.delete(mainWindow.id)
  })
  
  setupWindow(mainWindow)
}

async function setupWindow(window: BrowserWindow) {
  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  await loadWindowContent(window)
  return window
}

// This method will be called when Electron has finished
// initialization and is ready to create browser all_windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for all_windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.handle('ping', () => 'pong')

  // 监听登录状态同步请求
  ipcMain.handle('get-login-state', async (event) => {
    const currentWindow = BrowserWindow.fromWebContents(event.sender)
    if (!currentWindow) return false

    // 获取所有其他窗口
    const promises = []
    all_windows.forEach((win) => {
      if (win && win !== currentWindow && !win.isDestroyed()) {
        promises.push(new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(null), 3000) // 3秒超时
          win.webContents.send('request-login-state', currentWindow.id)
          ipcMain.once(`login-state-response-${currentWindow.id}`, (_, data) => {
            clearTimeout(timeout)
            resolve(data)
          })
        }))
      }
    })

    const results = await Promise.all(promises)
    return results.find(result => result !== null) || false
  })

  // 监听登录状态发送
  ipcMain.on('send-login-state', (event, targetId, loginData) => {
    const targetWindow = all_windows.get(targetId)
    if (targetWindow && !targetWindow.isDestroyed()) {
      targetWindow.webContents.send('receive-login-state', loginData)
      event.reply(`login-state-response-${targetId}`, loginData)
    }
  })

  // 监听打开新窗口的消息
  ipcMain.handle('open-new-window', async () => {
    try {
      console.log('Opening new window...')
      const newWindow = new BrowserWindow(createWindowConfig({
        width: 1400,
        height: 700,
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false,
          contextIsolation: true,
          nodeIntegration: false
        }
      }))
      
      all_windows.set(newWindow.id, newWindow)
      newWindow.setTitle('12306 抢票助手 - 主界面')
      
      newWindow.on('closed', () => {
        all_windows.delete(newWindow.id)
      })

      newWindow.on('ready-to-show', () => {
        newWindow.show()
        newWindow.webContents.send('sync-login-state')
      })

      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        await newWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
      } else {
        await newWindow.loadFile(join(__dirname, '../renderer/index.html'))
      }
      
      return true
    } catch (error) {
      console.error('Failed to create new window:', error)
      throw error
    }
  })

  // 处理登出请求
  ipcMain.handle('logout', () => {
    try {
      closeAllChildWindows()
      loginData = null
      return true
    } catch (error) {
      console.error('Error during logout:', error)
      return false
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other all_windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all all_windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  all_windows.clear()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// Handle window controls via IPC
ipcMain.on('window-controls', (_, command) => {
  const window = BrowserWindow.getFocusedWindow()
  if (!window) return

  switch (command) {
    case 'minimize':
      window.minimize()
      break
    case 'maximize':
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize() 
      }
      break
    case 'close':
      window.close()
      break
  }
})
/**
 * 发送普通IPC消息
 * @param data 要发送的数据
 */
export function sendIpcMessage(data: string) {
    if (!window.api) {
        console.error('IPC API not available')
        return
    }
    window.api.send(data)
}

/**
 * 打开新窗口
 */
export function openNewWindow() {
    if (!window.api) {
        console.error('IPC API not available')
        return
    }
    window.api.send('open-new-window')
}
import {contextBridge, ipcRenderer} from 'electron'
import {MAPI} from "../mapi/render";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

MAPI.init()
ipcRenderer.on('MAIN_PROCESS_MESSAGE', (_event: any, payload: any) => {
    switch (payload.type) {
        case 'APP_READY':
            MAPI.init(payload.data)
            break
        default:
            console.warn('Unknown message from main process:', payload)
            break
    }
})

// --------- Expose some API to the Renderer process ---------
// contextBridge.exposeInMainWorld('ipcRenderer', {
//     on(...args: Parameters<typeof ipcRenderer.on>) {
//         const [channel, listener] = args
//         return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
//     },
//     off(...args: Parameters<typeof ipcRenderer.off>) {
//         const [channel, ...omit] = args
//         return ipcRenderer.off(channel, ...omit)
//     },
//     send(...args: Parameters<typeof ipcRenderer.send>) {
//         const [channel, ...omit] = args
//         return ipcRenderer.send(channel, ...omit)
//     },
//     invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
//         const [channel, ...omit] = args
//         return ipcRenderer.invoke(channel, ...omit)
//     },
// })


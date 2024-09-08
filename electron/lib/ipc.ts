import {BrowserWindow} from "electron";

export const IPC = {
    win: null as BrowserWindow | null,
    init: (win: BrowserWindow) => {
        IPC.win = win
    },
    send: (type: string, data: any = {}) => {
        IPC.win?.webContents.send('main-process-message', {
            type, data
        })
    }
}

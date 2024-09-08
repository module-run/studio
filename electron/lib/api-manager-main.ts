import {BrowserWindow, dialog} from "electron";
import {WindowConstant} from "./constant";
import {Log} from "./log";
import {Storage} from "./storage";
import {Config} from "./config";
import {File} from "./file";

export default class ApiManagerMain {

    register(app: Electron.App, win: BrowserWindow, ipcMain: Electron.IpcMain) {
        ipcMain.handle('app:quit', () => {
            app.quit()
        })
        ipcMain.handle('window:min', () => {
            win?.minimize()
        })
        ipcMain.handle('window:max', () => {
            if (win.isMaximized()) {
                win.unmaximize()
                win.center()
            } else {
                win.setMinimumSize(WindowConstant.minWidth, WindowConstant.minHeight)
                win.maximize()
            }
        })
        ipcMain.handle('window:setSize', (event, width: number, height: number) => {
            win.setMinimumSize(width, height)
            win.setSize(width, height)
            win.center()
        })
        ipcMain.handle('log:info', (event, label: string, data: any) => {
            Log.info(label, data)
        })
        ipcMain.handle('log:error', (event, label: string, data: any) => {
            Log.error(label, data)
        })
        ipcMain.handle('config:setRoot', (event, root: string) => {
            Config.setRoot(root)
        })
        ipcMain.handle('config:get', (event, key: string, defaultValue: any) => {
            return Config.get(key, defaultValue)
        })
        ipcMain.handle('config:set', (event, key: string, value: any) => {
            Config.set(key, value)
        })
        ipcMain.handle('storage:setRoot', (event, root: string) => {
            Storage.setRoot(root)
        })
        ipcMain.handle('storage:get', (event, group: string, key: string, defaultValue: any) => {
            return Storage.get(group, key, defaultValue)
        })
        ipcMain.handle('storage:set', (event, group: string, key: string, value: any) => {
            Storage.set(group, key, value)
        })
        ipcMain.handle('file:setRoot', (event, root: string) => {
            File.setRoot(root)
        });
        ipcMain.handle('file:absolutePath', (event, path: string) => {
            return File.absolutePath(path)
        });
        ipcMain.handle('file:exists', (event, path: string) => {
            return File.exists(path)
        });
        ipcMain.handle('file:isDirectory', (event, path: string) => {
            return File.isDirectory(path)
        });
        ipcMain.handle('file:mkdir', (event, path: string) => {
            File.mkdir(path)
        });
        ipcMain.handle('file:list', (event, path: string) => {
            return File.list(path)
        });
        ipcMain.handle('file:listAll', (event, path: string) => {
            return File.listAll(path)
        });
        ipcMain.handle('file:write', (event, path: string, data: any) => {
            File.write(path, data)
        })
        ipcMain.handle('file:read', (event, path: string) => {
            return File.read(path)
        })
        ipcMain.handle('file:delete', (event, path: string) => {
            File.delete(path)
        })
        ipcMain.handle('file:rename', (event, pathOld: string, pathNew: string) => {
            File.rename(pathOld, pathNew)
        })
        ipcMain.handle('file:showOpenDialog', (event, options: Electron.OpenDialogOptions) => {
            return dialog.showOpenDialog(win, options)
        })
    }
}

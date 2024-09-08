export default class ApiManagerRender {

    getPreloadApi(ipcRenderer: Electron.IpcRenderer) {
        return {
            appQuit: () => ipcRenderer.invoke('app:quit'),
            windowMin: () => ipcRenderer.invoke('window:min'),
            windowMax: () => ipcRenderer.invoke('window:max'),
            setWindowSize: (width: number, height: number) => ipcRenderer.invoke('window:setSize', width, height),
            logInfo: (label: string, data: any = null) => ipcRenderer.invoke('log:info', label, data),
            logError: (label: string, data: any = null) => ipcRenderer.invoke('log:error', label, data),
            configSetRoot: (root: string) => ipcRenderer.invoke('config:setRoot', root),
            configGet: (key: string, defaultValue: any = null) => ipcRenderer.invoke('config:get', key, defaultValue),
            configSet: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value),
            storageSetRoot: (root: string) => ipcRenderer.invoke('storage:setRoot', root),
            storageGet: (group: string, key: string, defaultValue: any = null) => ipcRenderer.invoke('storage:get', group, key, defaultValue),
            storageSet: (group: string, key: string, value: any) => ipcRenderer.invoke('storage:set', group, key, value),
            fileSetRoot: (root: string) => ipcRenderer.invoke('file:setRoot', root),
            fileAbsolutePath: (path: string) => ipcRenderer.invoke('file:absolutePath', path),
            fileExists: (path: string) => ipcRenderer.invoke('file:exists', path),
            fileIsDirectory: (path: string) => ipcRenderer.invoke('file:isDirectory', path),
            fileMkdir: (path: string) => ipcRenderer.invoke('file:mkdir', path),
            fileList: (path: string) => ipcRenderer.invoke('file:list', path),
            fileListAll: (path: string) => ipcRenderer.invoke('file:listAll', path),
            fileWrite: (path: string, data: any) => ipcRenderer.invoke('file:write', path, data),
            fileRead: (path: string) => ipcRenderer.invoke('file:read', path),
            fileDelete: (path: string) => ipcRenderer.invoke('file:delete', path),
            fileRename: (pathOld: string, pathNew: string) => ipcRenderer.invoke('file:rename', pathOld, pathNew),
            fileShowOpenDialog: (options: Electron.OpenDialogOptions) => ipcRenderer.invoke('file:showOpenDialog', options),
        }
    }
}

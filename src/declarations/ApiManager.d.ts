declare interface Window {
    MAPI: {
        appQuit: () => Promise<void>,
        windowMin: () => Promise<void>,
        windowMax: () => Promise<void>,
        setWindowSize: (width: number, height: number) => Promise<void>,
        logInfo: (label: string, data: any = null) => Promise<void>,
        logError: (label: string, data: any = null) => Promise<void>,
        configSetRoot: (root: string) => Promise<void>,
        configGet: (key: string, defaultValue: any = null) => Promise<any>,
        configSet: (key: string, value: any) => Promise<void>,
        storageSetRoot: (root: string) => Promise<void>,
        storageGet: (group: string, key: string, defaultValue: any = null) => Promise<any>,
        storageSet: (group: string, key: string, value: any) => Promise<void>,
        fileSetRoot: (root: string) => Promise<void>,
        fileAbsolutePath: (path: string) => Promise<string>,
        fileExists: (path: string) => Promise<boolean>,
        fileIsDirectory: (path: string) => Promise<boolean>,
        fileMkdir: (path: string) => Promise<void>,
        fileList: (path: string) => Promise<any[]>,
        fileListAll: (path: string) => Promise<any[]>,
        fileWrite: (path: string, data: any) => Promise<void>,
        fileRead: (path: string) => Promise<any>,
        fileDelete: (path: string) => Promise<void>,
        fileRename: (pathOld: string, pathNew: string) => Promise<void>,
        fileShowOpenDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>,
    }
}



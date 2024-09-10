declare interface Window {
    $mapi: {
        app: {
            quit: () => Promise<void>,
            windowMin: () => Promise<void>,
            windowMax: () => Promise<void>,
            windowSetSize: (width: number, height: number) => Promise<void>,
        },
        config: {
            get: (key: string, defaultValue: any) => Promise<any>,
            set: (key: string, value: any) => Promise<void>,
            all: () => Promise<any>,
        },
        log: {
            info: (msg: string, data: any = null) => Promise<void>,
            error: (msg: string, data: any = null) => Promise<void>,
        },
        storage: {
            all: () => Promise<any>,
            get: (group: string, key: string, defaultValue: any) => Promise<any>,
            set: (group: string, key: string, value: any) => Promise<void>,
        },
        file: {
            absolutePath: (path: string) => Promise<string>,
            exists: (path: string) => Promise<boolean>,
            isDirectory: (path: string) => Promise<boolean>,
            mkdir: (path: string) => Promise<void>,
            list: (path: string) => Promise<any[]>,
            listAll: (path: string) => Promise<any[]>,
            write: (path: string, data: any) => Promise<void>,
            read: (path: string) => Promise<any>,
            deletes: (path: string) => Promise<void>,
            rename: (pathOld: string, pathNew: string) => Promise<void>,
        }
    }
}



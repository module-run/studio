import {useAppStore} from "../store/modules/app";

const appStore = useAppStore()

if (window['ipcRenderer']) {
    window['ipcRenderer'].on('main-process-message', (_event: any, payload: any) => {
        // console.log('[MainProcessMessage]', payload.type, payload.data)
        switch (payload.type) {
            case 'ready':
                appStore.setAppRoot(payload.data.appRoot)
                break
        }
    })
}

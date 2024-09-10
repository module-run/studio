import {ipcRenderer} from "electron";

const quit = () => {
    return ipcRenderer.invoke('app:quit')
}

const windowMin = () => {
    return ipcRenderer.invoke('window:min')
}

const windowMax = () => {
    return ipcRenderer.invoke('window:max')
}

const windowSetSize = (width: number, height: number) => {
    return ipcRenderer.invoke('window:setSize', width, height)
}

export default {
    quit,
    windowMin,
    windowMax,
    windowSetSize
}

import {defineStore} from "pinia"
import store from "../index";
import {ModuleRunConfig} from "../../config";

export const settingStore = defineStore("setting", {
    state() {
        return {
            version: ModuleRunConfig.version,
        }
    },
    actions: {

    }
})

export const useSettingStore = () => {
    return settingStore(store)
}

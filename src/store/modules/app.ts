import {defineStore} from "pinia"
import store from "../index";
import {type Ref, ref} from "vue";

type AppStore = {
    name: Ref<string>
    version: Ref<string>
    update: (data: object) => void
}

export const appStore = defineStore("app", {
    state() {
        return {
            appRoot: null as string | null,
        }
    },
    actions: {
        setAppRoot(root: string) {
            this.appRoot = root
        }
    }
})

export const useAppStore = () => {
    return appStore(store)
}

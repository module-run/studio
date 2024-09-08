import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";

import ArcoVue, {Message} from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'

import {i18n} from "./lang";

import './style.less'
import {Dialog} from "./lib/dialog";

import './lib/ipc'
import {CommonComponents} from "./components/common";

const app = createApp(App)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(CommonComponents)
app.use(i18n)
app.use(store)
app.use(router)
Message._context = app._context
app.config.globalProperties.$mapi = window.MAPI
app.config.globalProperties.$dialog = Dialog
app.mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })

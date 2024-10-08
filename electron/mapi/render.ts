import {exposeContext} from "./util";
import {AppEnv} from "./env";

import config from "./config";
import log from "./log/render";
import app from "./app/render";
import storage from "./storage";
import file from "./file";
import event from "./event/render";
import ui from "./ui/render";
import updater from "./updater/render";
import statistics from "./statistics";

export const MAPI = {
    init(env: typeof AppEnv = null) {
        if (!env) {
            // expose context
            exposeContext('$mapi', {
                app,
                log,
                config,
                storage,
                file,
                event,
                ui,
                updater,
                statistics,
            })
            event.init()
            ui.init()
        } else {
            // init context
            AppEnv.appRoot = env.appRoot
            AppEnv.appData = env.appData
            AppEnv.userData = env.userData
            AppEnv.isInit = true
        }
    },
}

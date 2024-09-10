import {exposeContext} from "./util";
import {AppEnv} from "./env";

import config from "./config";
import log from "./log/render";
import app from "./app/render";
import storage from "./storage";
import file from "./file";

export const MAPI = {
    init(env: typeof AppEnv = null) {
        if (!env) {
            // expose context
            exposeContext('$mapi', {
                app,
                log,
                config,
                storage,
                file
            })
        } else {
            // init context
            AppEnv.appRoot = env.appRoot
            AppEnv.appData = env.appData
            AppEnv.userData = env.userData
            AppEnv.isInit = true
        }
    },
}

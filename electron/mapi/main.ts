import config from "./config";
import log from "./log";
import app from "./app";
import storage from "./storage";
import file from "./file";

export const MAPI = {
    init() {
        // expose context
        const $mapi = {
            app,
            log,
            config,
            storage,
            file,
        }
    }
}

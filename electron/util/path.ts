import {resolve} from "node:path";


export const buildResolve = value =>
    resolve(`electron/resources/build/${value}`)

import {Base64} from "js-base64";

// const {base64encode, base64decode} = require('nodejs-base64');

export const EncodeUtil = {
    base64Encode(str: string) {
        return Base64.encode(str)
    },
    base64Decode(str: string) {
        return Base64.decode(str)
    }
}

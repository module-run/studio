import path from "node:path";
import fs from "node:fs"
import date from "date-and-time"

export const Log = {
    env: {
        root: '',
        console: true,
        fileStream: null,
        fileName: null,
    },
    init(env: object = {}) {
        Log.env = Object.assign(Log.env, env)
    },
    stringDatetime() {
        return date.format(new Date(), 'YYYYMMDD')
    },
    logsDir() {
        return path.join(Log.env.root, 'logs')
    },
    file() {
        return path.join(Log.logsDir(), 'log_' + Log.stringDatetime() + '.log')
    },
    log(level: 'INFO' | 'ERROR', label: string, data: any = null) {
        if (Log.env.fileName !== Log.file()) {
            Log.env.fileName = Log.file()
            const logDir = Log.logsDir()
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir)
            }
            if (Log.env.fileStream) {
                Log.env.fileStream.end()
            }
            Log.env.fileStream = fs.createWriteStream(Log.file(), {flags: 'a'})
        }
        let line = []
        line.push(date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'))
        line.push(level)
        line.push(label)
        if (data) {
            line.push(JSON.stringify(data))
        }
        if (Log.env.console) {
            console.log(line.join(' - '))
        }
        Log.env.fileStream.write(line.join(' - ') + "\n")
    },
    info(label: string, data: any = null) {
        Log.log('INFO', label, data)
    },
    error(label: string, data: any = null) {
        Log.log('ERROR', label, data)
    },
}

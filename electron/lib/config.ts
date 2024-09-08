import path from "node:path"
import fs from "node:fs"

export const Config = {
    env: {
        root: '',
        data: {},
    },
    init(env: object = {}) {
        Config.env = Object.assign(Config.env, env)
        Config.load()
    },
    setRoot(root: string) {
        Config.env.root = root
        Config.load()
    },
    file() {
        return path.join(Config.env.root, 'config.json')
    },
    load() {
        try {
            let json = fs.readFileSync(Config.file()).toString()
            json = JSON.parse(json)
            Config.env.data = json || {}
        } catch (e) {
            Config.env.data = {}
        }
    },
    save() {
        fs.writeFileSync(Config.file(), JSON.stringify(Config.env.data, null, 4))
    },
    set(key: string, value: any) {
        Config.env.data[key] = value
        Config.save()
    },
    get(key: string, defaultValue: any) {
        defaultValue = defaultValue || null
        if (key in Config.env.data) {
            return Config.env.data[key]
        }
        this.set(key, defaultValue)
        return defaultValue
    }
}

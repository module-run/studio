import path from "node:path"
import fs from "node:fs"

export const Storage = {
    env: {
        root: '',
        data: {},
    },
    init(env: object = {}) {
        Storage.env = Object.assign(Storage.env, env)
    },
    setRoot(root: string) {
        Storage.env.root = root
    },
    file(group: string) {
        return path.join(Storage.env.root, group + '.json')
    },
    load(group: string) {
        const filePath = Storage.file(group)
        Storage.env.data[group] = {}
        if (!fs.existsSync(filePath)) {
            return
        }
        try {
            let json = fs.readFileSync(filePath).toString()
            json = JSON.parse(json)
            Storage.env.data[group] = json || {}
        } catch (e) {
        }
    },
    save(group: string) {
        if (!fs.existsSync(Storage.env.root)) {
            fs.mkdirSync(Storage.env.root, {recursive: true})
        }
        const filePath = Storage.file(group)
        fs.writeFileSync(filePath, JSON.stringify(Storage.env.data[group], null, 4))
    },
    set(group: string, key: string, value: any) {
        if (!Storage.env.data[group]) {
            Storage.load(group)
        }
        Storage.env.data[group][key] = value
        Storage.save(group)
    },
    get(group: string, key: string, defaultValue: any) {
        defaultValue = defaultValue || null
        if (!Storage.env.data[group]) {
            Storage.load(group)
        }
        if (key in Storage.env.data[group]) {
            return Storage.env.data[group][key]
        }
        this.set(group, key, defaultValue)
        return defaultValue
    }
}

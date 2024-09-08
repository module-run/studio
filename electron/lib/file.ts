import fs from "node:fs"
import path from "node:path"

const nodePath = path

export const File = {
    env: {
        root: '',
    },
    init(env: object = {}) {
        File.env = Object.assign(File.env, env)
        if (!fs.existsSync(File.env.root)) {
            fs.mkdirSync(File.env.root, {recursive: true})
        }
    },
    setRoot(root: string) {
        File.env.root = root
    },
    absolutePath(path: string) {
        return `ABS://${path}`
    },
    fullPath(path: string) {
        if (path.startsWith('ABS://')) {
            return path.replace(/^ABS:\/\//, '')
        }
        return nodePath.join(File.env.root, path)
    },
    exists(path: string) {
        const fullPath = File.fullPath(path)
        return fs.existsSync(fullPath)
    },
    isDirectory(path: string) {
        const fullPath = File.fullPath(path)
        if (!fs.existsSync(fullPath)) {
            return false
        }
        return fs.statSync(fullPath).isDirectory()
    },
    mkdir(path: string) {
        const fullPath = File.fullPath(path)
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true})
        }
    },
    list(path: string) {
        const fullPath = File.fullPath(path)
        if (!fs.existsSync(fullPath)) {
            return []
        }
        const files = fs.readdirSync(fullPath)
        return files.map(file => {
            const stat = fs.statSync(nodePath.join(fullPath, file))
            let f = {
                name: file,
                isDirectory: stat.isDirectory(),
                size: stat.size,
                lastModified: stat.mtimeMs,
            }
            return f
        })
    },
    listAll(path: string) {
        const fullPath = File.fullPath(path)
        if (!fs.existsSync(fullPath)) {
            return []
        }
        const listDirectory = (path: string, basePath: string = '') => {
            let files = []
            const list = fs.readdirSync(path)
            for (let file of list) {
                const stat = fs.statSync(nodePath.join(path, file))
                let fPath = nodePath.join(basePath, file)
                fPath = fPath.replace(/\\/g, '/')
                let f = {
                    name: file,
                    path: fPath,
                    isDirectory: stat.isDirectory(),
                    size: stat.size,
                    lastModified: stat.mtimeMs,
                }
                if (f.isDirectory) {
                    files = files.concat(listDirectory(nodePath.join(path, file), f.path))
                    continue
                }
                files.push(f)
            }
            return files
        }
        return listDirectory(fullPath)
    },
    write(path: string, data: any) {
        const fullPath = File.fullPath(path)
        const fullPathDir = nodePath.dirname(fullPath)
        if (!fs.existsSync(fullPathDir)) {
            fs.mkdirSync(fullPathDir, {recursive: true})
        }
        if (typeof data === 'string') {
            data = {
                content: data,
            }
        }
        const f = fs.openSync(fullPath, 'w')
        fs.writeSync(f, data.content)
        fs.closeSync(f)
    },
    read(path: string) {
        const fullPath = File.fullPath(path)
        if (!fs.existsSync(fullPath)) {
            return null
        }
        const f = fs.openSync(fullPath, 'r')
        const content = fs.readFileSync(f, 'utf8')
        fs.closeSync(f)
        return content
    },
    delete(path: string) {
        const fullPath = File.fullPath(path)
        if (!fs.existsSync(fullPath)) {
            return
        }
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
            fs.rmdirSync(fullPath, {recursive: true})
        } else {
            fs.unlinkSync(fullPath)
        }
    },
    rename(pathOld: string, pathNew: string) {
        const fullPathOld = File.fullPath(pathOld)
        const fullPathNew = File.fullPath(pathNew)
        if (!fs.existsSync(fullPathOld)) {
            return
        }
        if (fs.existsSync(fullPathNew)) {
            throw new Error(`File already exists: ${fullPathNew}`)
        }
        fs.renameSync(fullPathOld, fullPathNew)
    }
}

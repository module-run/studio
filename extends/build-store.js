import fs from 'fs';
import path from "node:path";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 将当前目录的所有目录文件遍历，读取里面的 config.json 文件配置，合并到一个新的 store.json 文件中。

const root = path.resolve(__dirname, './');
const extendList = []
const extendAllVersion = []
const extendAllVersionFiles = {}

const dirs = fs.readdirSync(root);
dirs.forEach((dir) => {
    const stat = fs.statSync(path.resolve(root, dir));
    if (stat.isDirectory()) {

        // 读取配置文件
        const configPath = path.resolve(root, dir, '1.0.0', 'config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            extendList.push(config);
        }

        // 读取所有版本配置
        const versions = fs.readdirSync(path.resolve(root, dir));
        versions.forEach((version) => {
            const versionStat = fs.statSync(path.resolve(root, dir, version));
            if (versionStat.isDirectory()) {
                const configPath = path.resolve(root, dir, version, 'config.json');
                if (fs.existsSync(configPath)) {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                    extendAllVersion.push(config);
                }
            }
        })

        // 读取所有文件列表
        const files = fs.readdirSync(path.resolve(root, dir));


    }
})

fs.writeFileSync(path.resolve(root, 'extends.json'), JSON.stringify(extendList, null, 4), 'utf-8');
fs.writeFileSync(path.resolve(root, 'versions.json'), JSON.stringify(extendAllVersion, null, 4), 'utf-8');



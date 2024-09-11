import {ProjectExtendRecord} from "../types/Project";
import {FileItem} from "../types/File";
import {EncodeUtil, TimeUtil, VersionUtil} from "../lib/util";
import LogoDefault from '../assets/image/extend.svg'
import {MarkdownUtil} from "../lib/markdown";

export const ExtendStoreService = {

    async extendsRoot(): Promise<string> {
        const root = await window.$mapi.app.resourcePathResolve('extends')
        return window.$mapi.file.absolutePath(root)
    },

    async extendsFiles(): Promise<FileItem[]> {
        const extendsRoot = await this.extendsRoot()
        const files = await window.$mapi.file.list(extendsRoot)
        return files.filter(f => f.isDirectory)
    },

    async list(): Promise<ProjectExtendRecord[]> {
        // await this.getData('example', '1.1.0')
        const extendsRoot = await this.extendsRoot()
        let results: any[] = []
        for (let f of await this.extendsFiles()) {
            const configPath = `${extendsRoot}/${f.name}/1.0.0/config.json`
            if (!await window.$mapi.file.exists(configPath)) {
                continue
            }
            const config = JSON.parse(await window.$mapi.file.read(configPath))
            if (!config.logo) {
                config.logo = LogoDefault
            }
            results.push(config)
        }
        return results
    },
    async getDetail(name: string): Promise<any> {
        const extendsRoot = await this.extendsRoot()
        const extendRoot = `${extendsRoot}/${name}`
        const versionFolders = await window.$mapi.file.list(extendRoot)
        let versions: any[] = []
        for (let f of versionFolders) {
            if (!f.isDirectory) {
                continue
            }
            const configPath = `${extendRoot}/${f.name}/config.json`
            if (!await window.$mapi.file.exists(configPath)) {
                continue
            }
            const changelogPath = `${extendRoot}/${f.name}/changelog.md`
            const changelogContent = await window.$mapi.file.read(changelogPath)
            // 第一行为版本描述，剩余为版本内容
            const changelogLines = (changelogContent || '').trim().split('\n')
            const changelogContentSummary = changelogLines[0] || `版本 ${f.name}`
            const changelogContentDetail = changelogLines.slice(1).join('\n') || '无'
            versions.push({
                version: f.name,
                time: TimeUtil.formatDate(f.lastModified),
                summary: changelogContentSummary.trim(),
                content: MarkdownUtil.toHtml(changelogContentDetail.trim()),
            })
        }
        versions.sort((a, b) => {
            return VersionUtil.compare(b.version, a.version)
        })
        const contentPath = `${extendRoot}/content.md`
        const contentContent = await window.$mapi.file.read(contentPath)
        const detailData = {}
        detailData['content'] = MarkdownUtil.toHtml(contentContent)
        detailData['versions'] = versions
        return detailData
    },
    async getData(name: string, version: string): Promise<any> {
        const extendsRoot = await this.extendsRoot()
        const extendRoot = `${extendsRoot}/${name}/${version}`
        const data = {
            config: null as ProjectExtendRecord | null,
            files: [] as FileItem[]
        }
        data.files = await window.$mapi.file.listAll(extendRoot)
        data.files = data.files.filter(f => !f.isDirectory)
        for (let f of data.files) {
            const content = await window.$mapi.file.read(`${extendRoot}/${f.name}`)
            f.contentBase64 = EncodeUtil.base64Encode(content)
            if (f.name === 'config.json') {
                data.config = JSON.parse(content)
                if (data.config && !data.config.logo) {
                    data.config.logo = LogoDefault
                }
            }
        }
        return data
    }
}

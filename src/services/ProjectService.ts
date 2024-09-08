import {
    EnumProjectType,
    ProjectExtendRecord, ProjectExtendRecordConfig,
    ProjectModuleDataRecord,
    ProjectModuleRecord,
    ProjectModuleRecordConfig,
    ProjectRecord,
    ProjectRecordConfig
} from "../types/Project";
import {pick} from "lodash-es";
import {FileItem} from "../types/File";
import {EncodeUtil} from "../lib/util";

const CodeConstant = {
    moduleMainPy: `
def block_1:
    # 生成的代码
    pass

def block_2:
    # 生成的代码
    pass
`,
    moduleMainBlocklyJson: `{}`
}


export const ProjectService = {

    async parseFileAsJson<T>(project: ProjectRecord, path: string): Promise<T | null> {
        let content = await window.MAPI.fileRead(`project/${project.id}/${path}`)
        if (!content) {
            return null
        }
        try {
            return JSON.parse(content) as T
        } catch (e) {
        }
        return null
    },

    stringifyJson(data: any): string {
        return JSON.stringify(data, null, 4)
    },

    async list(): Promise<ProjectRecord[]> {
        const records = await window.MAPI.fileList('project')
        let projects: ProjectRecord[] = []
        for (let r of records.filter(r => r.isDirectory)) {
            let config = await this.parseFileAsJson<ProjectRecordConfig>({
                id: r.name,
            } as ProjectRecord, 'config.json')
            if (!config) {
                continue
            }
            const project = pick(config, [
                'type', 'id', 'title',
                'createdAt', 'updatedAt',
                'defaultDevice',
                'pipDependencies'
            ]) as ProjectRecord
            projects.push(project)
        }
        // order by updatedAt desc
        projects = projects.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1)
        return projects
    },
    async add(project: ProjectRecord): Promise<ProjectRecord> {
        await window.MAPI.fileMkdir(`project/${project.id}`)
        const projectConfig = pick(project, [
            'type', 'id', 'title',
            'createdAt', 'updatedAt',
            'defaultDevice',
            'pipDependencies',
        ]) as ProjectRecordConfig
        await window.MAPI.fileWrite(`project/${project.id}/config.json`, this.stringifyJson(projectConfig))
        await window.MAPI.fileMkdir(`project/${project.id}/module`)
        await window.MAPI.fileWrite(`project/${project.id}/module/main/main.py`, CodeConstant.moduleMainPy)
        await window.MAPI.fileWrite(`project/${project.id}/module/main/config.json`, this.stringifyJson({
            title: '模块',
            author: '',
            description: '',
            logo: '',
            createdAt: Date.now(),
            updatedAt: Date.now()
        } as ProjectModuleRecordConfig))
        if (project.type === EnumProjectType.Blockly) {
            await window.MAPI.fileWrite(`project/${project.id}/module/main/blockly.json`, this.stringifyJson(CodeConstant.moduleMainBlocklyJson))
        }
        await window.MAPI.fileMkdir(`project/${project.id}/extend`)
        return project
    },
    async edit(project: ProjectRecord) {
        const projectConfig = pick(project, [
            'type', 'id', 'title',
            'createdAt', 'updatedAt',
            'defaultDevice',
            'pipDependencies',
        ]) as ProjectRecordConfig
        await window.MAPI.fileWrite(`project/${project.id}/config.json`, this.stringifyJson(projectConfig))
    },
    async delete(project: ProjectRecord) {
        await window.MAPI.fileDelete(`project/${project.id}`)
    },
    async listModules(project: ProjectRecord): Promise<ProjectModuleRecord[]> {
        const records = await window.MAPI.fileList(`project/${project.id}/module`)
        const modules: ProjectModuleRecord[] = []
        for (let r of records) {
            let config = await this.parseFileAsJson<ProjectModuleRecordConfig>(project, `module/${r.name}/config.json`)
            if (!config) {
                continue
            }
            const module = pick(config, [
                'name', 'title', 'author', 'description', 'logo'
            ]) as ProjectModuleRecord
            module.name = r.name
            modules.push(module)
        }
        return modules
    },
    async addModule(project: ProjectRecord): Promise<ProjectModuleRecord> {
        let moduleIndex = 1;
        for (; ;) {
            if (!await window.MAPI.fileExists(`project/${project.id}/module/module${moduleIndex}`)) {
                break
            }
            moduleIndex++
        }
        const module = {
            title: `模块${moduleIndex}`,
            author: '',
            description: '',
            logo: '',
            createdAt: Date.now(),
            updatedAt: Date.now()
        } as ProjectModuleRecordConfig
        await window.MAPI.fileMkdir(`project/${project.id}/module/module${moduleIndex}`)
        await window.MAPI.fileWrite(`project/${project.id}/module/module${moduleIndex}/config.json`, this.stringifyJson(module))
        await window.MAPI.fileWrite(`project/${project.id}/module/module${moduleIndex}/main.py`, CodeConstant.moduleMainPy)
        if (project.type === EnumProjectType.Blockly) {
            await window.MAPI.fileWrite(`project/${project.id}/module/module${moduleIndex}/blockly.json`, this.stringifyJson(CodeConstant.moduleMainBlocklyJson))
        }
        return module as ProjectModuleRecord
    },
    async deleteModule(project: ProjectRecord, module: ProjectModuleRecord) {
        await window.MAPI.fileDelete(`project/${project.id}/module/${module.name}`)
    },
    async existsModule(project: ProjectRecord, name: string): Promise<boolean> {
        return await window.MAPI.fileExists(`project/${project.id}/module/${name}`)
    },
    async editModuleName(project: ProjectRecord, nameOld: string, nameNew: string) {
        await window.MAPI.fileRename(`project/${project.id}/module/${nameOld}`, `project/${project.id}/module/${nameNew}`)
    },
    async editModule(project: ProjectRecord, module: ProjectModuleRecord) {
        await window.MAPI.fileWrite(`project/${project.id}/module/${module.name}/config.json`, this.stringifyJson(module))
    },
    async loadModuleData(project: ProjectRecord, module: ProjectModuleRecord): Promise<ProjectModuleDataRecord> {
        const data = {} as ProjectModuleDataRecord
        data.codePy = await window.MAPI.fileRead(`project/${project.id}/module/${module.name}/main.py`)
        if (project.type === EnumProjectType.Blockly) {
            data.blocklyJson = await window.MAPI.fileRead(`project/${project.id}/module/${module.name}/blockly.json`)
        }
        return data
    },
    async editModuleData(project: ProjectRecord, module: ProjectModuleRecord, data: ProjectModuleDataRecord) {
        // console.log('editModuleData', project, module, data)
        await window.MAPI.fileWrite(`project/${project.id}/module/${module.name}/main.py`, data.codePy)
        if (project.type === EnumProjectType.Blockly) {
            await window.MAPI.fileWrite(`project/${project.id}/module/${module.name}/blockly.json`, data.blocklyJson)
        }
    },
    async listExtends(project: ProjectRecord): Promise<ProjectExtendRecord[]> {
        const records = await window.MAPI.fileList(`project/${project.id}/extend`)
        const extendList: ProjectExtendRecord[] = []
        for (let r of records) {
            let config = await this.parseFileAsJson<ProjectExtendRecordConfig>(project, `extend/${r.name}/config.json`)
            if (!config) {
                continue
            }
            const extend = pick(config, [
                'name', 'title', 'version', 'author', 'description', 'logo',
                'require', 'function'
            ]) as ProjectExtendRecord
            extendList.push(extend)
        }
        return extendList
    },
    async addExtend(project: ProjectRecord, extend: ProjectExtendRecord, files: FileItem[]): Promise<undefined> {
        for (let f of files) {
            const content = EncodeUtil.base64Decode(f.contentBase64)
            await window.MAPI.fileWrite(`project/${project.id}/extend/${extend.name}/${f.path}`, content)
        }
    },
    async deleteExtend(project: ProjectRecord, extend: ProjectExtendRecord) {
        await window.MAPI.fileDelete(`project/${project.id}/extend/${extend.name}`)
    },
}

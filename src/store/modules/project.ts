import {defineStore} from "pinia";
import {
    ProjectExtendRecord,
    ProjectModuleDataRecord,
    ProjectModuleRecord,
    ProjectPipRecord,
    ProjectRecord
} from "../../types/Project";
import store from "../index";
import {ProjectService} from "../../services/ProjectService";
import {StringUtil} from "../../lib/util";
import {clone} from "lodash-es";
import {DeviceRecord} from "../../types/Device";
import {FileItem} from "../../types/File";

export const projectStore = defineStore("project", {
    state: () => ({
        recordsInitialized: false,
        records: [] as ProjectRecord[],
        current: null as ProjectRecord | null,
        currentModules: [] as ProjectModuleRecord[],
        currentModuleActive: undefined as string | undefined,
        currentModuleActiveData: null as ProjectModuleDataRecord | null,
        currentExtends: [] as ProjectExtendRecord[],
    }),
    actions: {
        async refreshIfNeed() {
            if (this.recordsInitialized) {
                return
            }
            this.recordsInitialized = true
            await this.refresh()
        },
        async refresh() {
            this.records = await ProjectService.list()
            this.refreshUpdateTime()
        },
        refreshUpdateTime() {
            this.records = this.records.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1)
        },
        async add(record: ProjectRecord): Promise<ProjectRecord> {
            record = clone(record)
            record.id = 'project_' + StringUtil.random(16);
            record.createdAt = Date.now();
            record.updatedAt = Date.now();
            record.defaultDevice = ''
            record.pipDependencies = [];
            await ProjectService.add(record)
            await this.refresh()
            return record
        },
        async editField(record: ProjectRecord, field: string | null = null, value: string | null = null) {
            const project = this.getById(record?.id)
            if (!project) {
                return
            }
            if (field) {
                project[field] = value
            }
            project.updatedAt = Date.now()
            await ProjectService.edit(project)
            this.refreshUpdateTime()
        },
        async edit(record: ProjectRecord) {
            const project = this.getById(record.id)
            if (!project) {
                return
            }
            project.title = record.title
            await ProjectService.edit(project)
            this.refreshUpdateTime()
        },
        async open(id: string) {
            await this.refreshIfNeed()
            this.current = this.records.find(record => record.id === id) || null
            this.currentModules = []
            this.currentModuleActive = undefined
            this.currentExtends = []
            if (!this.current) {
                return
            }
            await this.loadModules()
            await this.loadExtends()
            await this.activeModule()
            // console.log('open', this.current)
        },
        async delete(project: ProjectRecord) {
            await ProjectService.delete(project)
            await this.refresh()
        },
        getById(id: string): ProjectRecord | null {
            return this.records.find(record => record.id === id) || null
        },
        async addPipDependency(pip: ProjectPipRecord) {
            if (!this.current) {
                return
            }
            if (!this.current.pipDependencies) {
                this.current.pipDependencies = []
            }
            pip = clone(pip)
            if (this.current.pipDependencies.find(p => p.name === pip.name)) {
                return
            }
            this.current.pipDependencies.push(pip)
            this.current.updatedAt = Date.now()
            await ProjectService.edit(this.current)
        },
        async deletePipDependency(pip: ProjectPipRecord) {
            if (!this.current) {
                return
            }
            if (!this.current.pipDependencies) {
                return
            }
            this.current.pipDependencies = this.current.pipDependencies.filter(p => p.name !== pip.name)
            this.current.updatedAt = Date.now()
            await ProjectService.edit(this.current)
        },
        async activeModule(module: ProjectModuleRecord | string | null = null) {
            if (!this.current) {
                return
            }
            if (typeof module === 'string') {
                module = {name: module} as ProjectModuleRecord
            }
            if (module) {
                this.currentModuleActive = module.name
            } else {
                if (this.currentModules.length > 0) {
                    this.currentModuleActive = this.currentModules[0].name
                    module = this.currentModules[0]
                } else {
                    this.currentModuleActive = undefined
                }
            }
            // console.log('activeModule', module)
            this.currentModuleActiveData = null
            if (this.currentModuleActive && module) {
                this.currentModuleActiveData = await ProjectService.loadModuleData(this.current, module)
            }
        },
        async loadModules() {
            if (!this.current) {
                return
            }
            this.currentModules = await ProjectService.listModules(this.current)
        },
        async addModule() {
            if (!this.current) {
                return
            }
            const module = await ProjectService.addModule(this.current)
            await this.loadModules()
            await this.activeModule(module)
            await this.editField(this.current)
        },
        async deleteModule(module: ProjectModuleRecord | string | null) {
            if (!this.current) {
                return
            }
            if (typeof module === 'string') {
                module = this.currentModules.find(m => m.name === module) || null
            }
            if (!module) {
                return
            }
            await ProjectService.deleteModule(this.current, module)
            await this.loadModules()
            if (this.currentModuleActive === module.name) {
                await this.activeModule()
            }
            await this.editField(this.current)
        },
        async editModuleName(nameOld: string, nameNew: string) {
            if (!this.current) {
                return
            }
            if (nameOld === nameNew) {
                return
            }
            if (await ProjectService.existsModule(this.current, nameNew)) {
                throw '模块名称重复'
            }
            await ProjectService.editModuleName(this.current, nameOld, nameNew)
            await this.loadModules()
            await this.activeModule(nameNew)
            await this.editField(this.current)
        },
        async editModule(module: ProjectModuleRecord) {
            if (!this.current) {
                return
            }
            const m = this.currentModules.find(m => m.name === module.name)
            if (!m) {
                return
            }
            m.title = module.title
            m.author = module.author
            m.description = module.description
            m.logo = module.logo
            m.updatedAt = Date.now()
            await ProjectService.editModule(this.current, m)
            await this.editField(this.current)
        },
        async editModuleData(data: ProjectModuleDataRecord) {
            if (!this.current || !this.currentModuleActive) {
                return
            }
            const module = this.currentModules.find(m => m.name === this.currentModuleActive)
            if (module) {
                await ProjectService.editModuleData(this.current, module, data)
                await this.editField(this.current)
            }
        },
        async setDefaultDevice(device: DeviceRecord) {
            if (!this.current) {
                return
            }
            // console.log('setDefaultDevice', JSON.stringify(device))
            this.current.defaultDevice = device.id as string
            await ProjectService.edit(this.current)
            await this.editField(this.current)
        },
        async loadExtends() {
            if (!this.current) {
                return
            }
            this.currentExtends = await ProjectService.listExtends(this.current)
        },
        async addExtend(extend: ProjectExtendRecord, files: FileItem[]) {
            if (!this.current) {
                return
            }
            await ProjectService.addExtend(this.current, extend, files)
            await this.loadExtends()
            await this.editField(this.current)
        },
        async deleteExtend(extend: ProjectExtendRecord) {
            if (!this.current) {
                return
            }
            await ProjectService.deleteExtend(this.current, extend)
            await this.loadExtends()
            await this.editField(this.current)
        }
    }
})

const project = projectStore(store)

project.refresh().then(() => {
})

export const useProjectStore = () => {
    return project
}

import {defineStore} from "pinia";
import store from "../index";
import {EnumLogType, LogRecord} from "../../types/Log";
import {useProjectStore} from "./project";
import {GlobalEvent} from "../../lib/event";
import {EventType} from "../../types/Event";

const RecordMax = 10 * 10000

const projectStore = useProjectStore()

export const logStore = defineStore("log", {
    state: () => ({
        records: [] as LogRecord[]
    }),
    actions: {
        init() {
        },
        pLog(level: EnumLogType, msg: string, data: any = null) {
            this.records.push({
                projectId: projectStore.current?.id || null,
                level,
                time: Date.now(),
                msg,
                data
            });
            if (this.records.length > RecordMax) {
                this.records = this.records.slice(RecordMax / 2)
            }
            GlobalEvent.emit(EventType.NewLog)
        },
        pLogInfo(msg: string, data: any = null) {
            this.pLog(EnumLogType.INFO, msg, data)
        },
        pLogWarn(msg: string, data: any = null) {
            this.pLog(EnumLogType.WARN, msg, data)
        },
        pLogError(msg: string, data: any = null) {
            this.pLog(EnumLogType.ERROR, msg, data)
        },
        log(level: EnumLogType, msg: string, data: any = null) {
            this.records.push({
                projectId: null,
                level,
                time: Date.now(),
                msg,
                data
            });
            if (this.records.length > RecordMax) {
                this.records = this.records.slice(RecordMax / 2)
            }
            GlobalEvent.emit(EventType.NewLog)
        },
        logInfo(msg: string, data: any = null) {
            this.log(EnumLogType.INFO, msg, data)
        },
        logWarn(msg: string, data: any = null) {
            this.log(EnumLogType.WARN, msg, data)
        },
        logError(msg: string, data: any = null) {
            this.log(EnumLogType.ERROR, msg, data)
        },
        clearByProjectId(projectId: string) {
            this.records = this.records.filter((r) => {
                if (r.projectId === projectId) {
                    return false
                }
                return true
            })
        },
        clear() {
            this.records = []
        }
    }
})


const log = logStore(store)
log.init()

export const useLogStore = () => {
    return log
}

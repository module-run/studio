import {defineStore} from "pinia"
import store from "../index";
import {DeviceRecord, EnumDeviceConnectStatus} from "../../types/Device";
import {StringUtil} from "../../lib/util";
import {Connect} from "../../lib/connect";
import {clone} from "lodash-es";

export const deviceStore = defineStore("device", {
    state: () => ({
        records: [] as DeviceRecord[]
    }),
    actions: {
        init() {
            window.MAPI.storageGet("device", "records", [])
                .then((records) => {
                    records.forEach((record: DeviceRecord) => {
                        record.status = EnumDeviceConnectStatus.WaitConnect
                        record.connect = null
                    })
                    this.records = records
                })
        },
        delete(index: number) {
            const record = this.records[index]
            if (record.connect) {
                record.connect.destory()
            }
            this.records.splice(index, 1)
            this.sync()
        },
        getById(id: string): DeviceRecord | null {
            return this.records.find((record) => record.id === id) || null
        },
        edit(index: number, record: DeviceRecord) {
            let connectChanged = false
            if (!connectChanged && this.records[index].addr !== record.addr) {
                connectChanged = true
            }
            if (!connectChanged && this.records[index].port !== record.port) {
                connectChanged = true
            }
            this.records[index].type = record.type
            this.records[index].connectType = record.connectType
            this.records[index].addr = record.addr
            this.records[index].port = record.port
            this.records[index].title = record.title
            this.sync()
            if (connectChanged) {
                this.reconnect(index)
            }
        },
        add(record: DeviceRecord) {
            record = clone(record)
            record.id = `device-${StringUtil.random()}`
            record.status = EnumDeviceConnectStatus.WaitConnect
            record.connect = null
            this.records.push(record)
            this.sync()
        },
        disconnect(indexOrId: number | string) {
            let device = null as DeviceRecord | null
            if (typeof indexOrId === "number") {
                device = this.records[indexOrId as number]
            } else {
                device = this.records.find((record) => record.id === indexOrId) || null
            }
            if (!device) {
                return
            }
            if (device.connect) {
                device.connect.destory()
            }
            device.status = EnumDeviceConnectStatus.Disconnected
        },
        connectReady(device: DeviceRecord) {
            return new Promise((resolve, reject) => {
                const timeoutTimer = setTimeout(() => {
                    reject('timeout')
                }, 10 * 1000)
                const check = () => {
                    if (device.connect && device.status === EnumDeviceConnectStatus.ConnectSuccess) {
                        clearTimeout(timeoutTimer)
                        resolve(true)
                    } else {
                        setTimeout(check, 100)
                    }
                }
                check()
            })
        },
        connect(device: DeviceRecord, forceReconnect: boolean = true) {
            if (!device.connect) {
                device.connect = new Connect(device)
                device.connect.on('ready', () => {
                    device.connect?.send('config', {}, true)
                        .then((payload) => {
                            device.info = []
                            for (let k in payload.data) {
                                device.info.push({
                                    name: k,
                                    value: payload.data[k]
                                })
                            }
                        })
                })
            }
            device.connect.connect(forceReconnect)
        },
        reconnect(indexOrId: number | string) {
            let device = null as DeviceRecord | null
            if (typeof indexOrId === "number") {
                device = this.records[indexOrId as number]
            } else {
                device = this.records.find((record) => record.id === indexOrId) || null
            }
            if (!device) {
                return
            }
            if (device.connect) {
                device.connect.destory()
            }
            this.connect(device)
        },
        sync() {
            const saveRecords = this.records.map((record) => {
                return {
                    id: record.id,
                    type: record.type,
                    connectType: record.connectType,
                    title: record.title,
                    addr: record.addr,
                    port: record.port,
                }
            })
            window.MAPI.storageSet("device", "records", saveRecords)
        },
    }
})

const device = deviceStore(store)
device.init()

export const useDeviceStore = () => {
    return device
}

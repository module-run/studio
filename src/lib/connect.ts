import {DeviceRecord, EnumDeviceConnectStatus} from "../types/Device";
import {StringUtil, TimeUtil} from "./util";
import {useLogStore} from "../store/modules/log";
import {EnumLogType} from "../types/Log";

type ConnectEvent = 'ready' | 'error'

const logStore = useLogStore()

type ConnectPayload = {
    id: string,
    type: string,
    response: {
        id: string,
        code: number,
        msg: string,
    },
    data: any | null,
}

export class Connect {
    device: DeviceRecord
    websocket: WebSocket | null = null
    lastActive: number | null = null
    pingTimer: any | null = null
    reconnectInterval: number = 5 * 1000
    reconnectRetryTimer: any | null = null
    responseListeners: Map<string, any> = new Map()
    responseTimeouts: Map<string, any> = new Map()
    listeners: Map<string, Array<Function>> = new Map()

    constructor(device: DeviceRecord) {
        this.device = device
    }

    testConnect(): Promise<string> {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`ws://${this.device.addr}:${this.device.port}/connect`)
            const timeoutTimer = setTimeout(() => {
                reject('timeout')
                try {
                    ws.close()
                } catch (e) {
                }
            }, 10 * 1000)
            ws.onopen = () => {
                ws.close()
                resolve('success')
                clearTimeout(timeoutTimer)
            }
            ws.onerror = () => {
                ws.close()
                reject('failed')
                clearTimeout(timeoutTimer)
            }
        })
    }

    on(type: ConnectEvent, listener: Function) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, [])
        }
        this.listeners.get(type)?.push(listener)
    }

    off(type: ConnectEvent, listener: Function) {
        if (this.listeners.has(type)) {
            const listeners = this.listeners.get(type)
            if (listeners) {
                const index = listeners.indexOf(listener)
                if (index !== -1) {
                    listeners.splice(index, 1)
                }
            }
        }
    }

    fire(type: ConnectEvent, data: any = null) {
        if (this.listeners.has(type)) {
            const listeners = this.listeners.get(type)
            if (listeners) {
                listeners.forEach((listener) => {
                    listener(data)
                })
            }
        }
    }

    connectRetry() {
        if (this.reconnectRetryTimer) {
            clearTimeout(this.reconnectRetryTimer)
        }
        if (this.websocket) {
            return
        }
        this.reconnectRetryTimer = setTimeout(() => {
            this.connect()
        }, this.reconnectInterval)
    }

    connect(forceReconnect: boolean = true) {
        if (!forceReconnect) {
            if (this.websocket) {
                return
            }
        }
        const websocket = new WebSocket(`ws://${this.device.addr}:${this.device.port}/connect`)
        this.device.status = EnumDeviceConnectStatus.Connecting
        if (this.websocket) {
            try {
                this.websocket.close()
            } catch (e) {
            }
        }
        websocket.onopen = () => {
            this.websocket = websocket
            this.device.status = EnumDeviceConnectStatus.ConnectSuccess
            this.fire('ready')
        }
        websocket.onclose = (e) => {
            console.log('websocket.onclose', e)
            this.websocket = null
            this.device.status = EnumDeviceConnectStatus.Disconnected
            this.connectRetry()
        }
        websocket.onerror = (e) => {
            console.log('websocket.onerror', e)
            this.websocket = null
            this.device.status = EnumDeviceConnectStatus.Disconnected
            this.connectRetry()
        }
        websocket.onmessage = (e) => {
            let payload: ConnectPayload
            this.lastActive = TimeUtil.timestampMS()
            try {
                payload = JSON.parse(e.data)
            } catch (e) {
                console.error('websocket.onmessage', e)
                return
            }
            this.processMessage(payload)
        }
        if (this.pingTimer) {
            clearInterval(this.pingTimer)
        }
        this.pingTimer = setInterval(() => {
            if (!this.lastActive || this.lastActive < TimeUtil.timestampMS() - 10 * 1000) {
                this.send('ping', {}, true)
                    .then((d) => {
                        this.lastActive = TimeUtil.timestampMS()
                    })
            }
        }, 5 * 1000)
    }

    generateId() {
        return StringUtil.random(32)
    }

    processMessage(payload: ConnectPayload) {
        if (payload.response) {
            const timer = this.responseTimeouts.get(payload.response.id)
            if (timer) {
                clearTimeout(timer)
                this.responseTimeouts.delete(payload.response.id)
            }
            const listener = this.responseListeners.get(payload.response.id)
            if (listener) {
                listener(payload)
                this.responseListeners.delete(payload.response.id)
            }
            return
        }
        if ('project.log' === payload.type) {
            if (payload.data.id && payload.data.level && payload.data.log) {
                if (Object.values(EnumLogType).includes(payload.data.level)) {
                    logStore.pLog(payload.data.level, payload.data.log)
                    return
                }
            }
        }
        console.warn('processMessage.unknown', JSON.stringify(payload))
    }

    send(
        type: string, data: any = {},
        waitResponse = false,
        validResponseCodes: Array<number> = [0]
    ): Promise<ConnectPayload> {
        const id = this.generateId()
        const promise: Promise<ConnectPayload> = new Promise((resolve, reject) => {
            if (waitResponse) {
                this.responseListeners.set(id, (payload: ConnectPayload) => {
                    if (validResponseCodes.includes(payload.response.code)) {
                        resolve(payload)
                    } else {
                        reject(payload)
                    }
                })
                this.responseTimeouts.set(id, setTimeout(() => {
                    reject({
                        id: this.generateId(),
                        response: {
                            id,
                            code: -1,
                            msg: 'timeout'
                        },
                    } as ConnectPayload)
                }, 60 * 1000))
            } else {
                resolve({} as ConnectPayload)
            }
        })
        this.sendPackage({id, type, data} as ConnectPayload)
        return promise
    }

    sendPackage(data: ConnectPayload) {
        if (this.websocket) {
            this.websocket.send(JSON.stringify(data))
        }
    }

    destory() {
        if (this.websocket) {
            try {
                this.websocket.close()
            } catch (e) {
            }
        }
        if (this.pingTimer) {
            clearInterval(this.pingTimer)
        }
        if (this.responseTimeouts.size > 0) {
            this.responseTimeouts.forEach((timer) => {
                clearTimeout(timer)
            })
            this.responseTimeouts.clear()
        }
    }
}

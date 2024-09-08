import {Connect} from "../lib/connect";

export enum EnumDeviceType {
    RaspberryPi = 'RaspberryPi',
}

export enum EnumDeviceConnectStatus {
    WaitConnect,
    Connecting,
    Disconnected,
    ConnectSuccess,
    ConnectFailed,
}

export enum EnumDeviceConnectType {
    NETWORK = 'network'
}

export type DeviceRecord = {
    id: string | null,
    type: EnumDeviceType | null,
    connectType: EnumDeviceConnectType | null,
    title: string,
    addr: string,
    port: string,

    status: EnumDeviceConnectStatus | null,
    connect: Connect | null,
    info: Array<object> | null,
}

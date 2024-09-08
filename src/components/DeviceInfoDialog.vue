<script setup lang="ts">
import {computed, ref} from "vue";
import {DeviceRecord, EnumDeviceConnectStatus, EnumDeviceConnectType, EnumDeviceType} from "../types/Device";
import {useDeviceStore} from "../store/modules/device";

const deviceStore = useDeviceStore()
const visible = ref(false)
const status = computed(() => {
    return deviceStore.records.find(d => d.id === deviceId.value)?.status || EnumDeviceConnectStatus.Disconnected
})
const deviceData = computed(() => {
    return deviceStore.records.find(d => d.id === deviceId.value) as DeviceRecord | null
})
const deviceId = ref('')
const show = (device: DeviceRecord) => {
    deviceId.value = device.id as string
    visible.value = true
}

const infoColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Value',
        dataIndex: 'value',
    },
];

const doConnect = () => {
    deviceStore.reconnect(deviceId.value as string)
}
const doDisconnect = () => {
    deviceStore.disconnect(deviceId.value as string)
}

defineExpose({
    show
})
</script>

<template>
    <a-modal v-model:visible="visible"
             width="50rem"
             :footer="false"
             title-align="start">
        <template #title>
            设备：{{ deviceData?.title }}
        </template>
        <div style="height:60vh;">
            <div>
                <div>
                    <div>
                        <img class="w-full mx-auto"
                             v-if="deviceData?.type===EnumDeviceType.RaspberryPi"
                             style="max-width:20rem;"
                             src="./../assets/device/RaspberryPi_5B.svg"/>
                    </div>
                    <div class="text-center text-xl mb-6">
                        <div v-if="deviceData?.type===EnumDeviceType.RaspberryPi">
                            树莓派
                        </div>
                    </div>
                    <div class="text-center mb-6">
                        <a-button v-if="status===EnumDeviceConnectStatus.ConnectSuccess"
                                  type="primary" status="danger"
                                  @click="doDisconnect()">
                            <template #icon>
                                <icon-link/>
                            </template>
                            断开设备
                        </a-button>
                        <a-button v-else @click="doConnect()"
                                  type="primary" status="success">
                            <template #icon>
                                <icon-link/>
                            </template>
                            连接设备
                        </a-button>
                    </div>
                    <div class="flex mx-4 border-b border-solid border-gray-200 p-2">
                        <div class="w-20">连接类型</div>
                        <div class="flex-grow">
                            <span v-if="deviceData?.connectType===EnumDeviceConnectType.NETWORK">网络</span>
                        </div>
                    </div>
                    <div class="flex mx-4 border-b border-solid border-gray-200 p-2">
                        <div class="w-20">网络地址</div>
                        <div class="flex-grow">
                            {{ deviceData?.addr + ':' + deviceData?.port }}
                        </div>
                    </div>
                    <div v-if="deviceData?.info"
                         class="flex mx-4 border-b border-solid border-gray-200 p-2">
                        <div class="w-20">详细信息</div>
                        <div class="flex-grow">
                            <div>
                                <a-table :columns="infoColumns" :data="deviceData?.info" size="mini"
                                         :pagination="false"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>


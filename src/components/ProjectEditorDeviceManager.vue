<script setup lang="ts">

import DeviceSelector from "./DeviceSelector.vue";
import {computed} from "vue";
import {useDeviceStore} from "../store/modules/device";
import {useProjectStore} from "../store/modules/project";
import {EnumDeviceConnectStatus, EnumDeviceConnectType, EnumDeviceType} from "../types/Device";

const deviceStore = useDeviceStore()
const projectStore = useProjectStore()

const selectedDevice = computed(() => {
    return deviceStore.records.find(d => d.id === projectStore.current?.defaultDevice) || null
})


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
    deviceStore.reconnect(selectedDevice?.value?.id as string)
}
const doDisconnect = () => {
    deviceStore.disconnect(selectedDevice?.value?.id as string)
}
</script>

<template>
    <div v-if="selectedDevice">
        <div>
            <img class="w-full mx-auto"
                 v-if="selectedDevice.type===EnumDeviceType.RaspberryPi"
                 style="max-width:20rem;"
                 src="./../assets/device/RaspberryPi_5B.svg"/>
        </div>
        <div class="text-center text-xl mb-6">
            <div v-if="selectedDevice.type===EnumDeviceType.RaspberryPi">
                树莓派
            </div>
        </div>
        <div class="text-center mb-6">
            <a-button v-if="selectedDevice.status===EnumDeviceConnectStatus.ConnectSuccess"
                      type="outline" status="danger"
                      @click="doDisconnect()">
                <template #icon>
                    <icon-link/>
                </template>
                断开设备
            </a-button>
            <a-button v-else @click="doConnect()"
                      type="outline" status="success">
                <template #icon>
                    <icon-link/>
                </template>
                连接设备
            </a-button>
        </div>
        <div class="flex mx-4 border-b border-solid border-gray-200 p-2">
            <div class="w-20">连接类型</div>
            <div class="flex-grow">
                <span v-if="selectedDevice.connectType===EnumDeviceConnectType.NETWORK">网络</span>
            </div>
        </div>
        <div class="flex mx-4 border-b border-solid border-gray-200 p-2">
            <div class="w-20">网络地址</div>
            <div class="flex-grow">
                {{ selectedDevice.addr + ':' + selectedDevice.port }}
            </div>
        </div>
        <div v-if="selectedDevice.info"
             class="mx-4 border-b border-solid border-gray-200 p-2">
            <div class="w-20">详细信息</div>
            <div class="flex-grow">
                <div>
                    <a-table :columns="infoColumns" :data="selectedDevice.info" size="mini"
                             :pagination="false"/>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="text-center py-10">
        <div class="mb-8">
            <i class="iconfont icon-empty-box text-gray-300 text-8xl"></i>
        </div>
        <div class="text-gray-400 mb-8">
            请选择设备
        </div>
        <div>
            <DeviceSelector/>
        </div>
    </div>
</template>

<style scoped>

</style>

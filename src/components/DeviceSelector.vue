<script setup lang="ts">
import {useDeviceStore} from "../store/modules/device";
import {DeviceRecord, EnumDeviceConnectStatus} from "../types/Device";
import {computed, ref} from "vue";
import DeviceInfoDialog from "./DeviceInfoDialog.vue";
import {useProjectStore} from "../store/modules/project";

const infoDialog = ref<InstanceType<typeof DeviceInfoDialog>>()
const deviceStore = useDeviceStore()
const projectStore = useProjectStore()

const devicesConnected = computed(() => {
    return deviceStore.records.filter(d => d.status === EnumDeviceConnectStatus.ConnectSuccess)
})
const devicesDisconnected = computed(() => {
    return deviceStore.records.filter(d => d.status !== EnumDeviceConnectStatus.ConnectSuccess)
})
const selectedDevice = computed(() => {
    return deviceStore.records.find(d => d.id === projectStore.current?.defaultDevice) || null
})
const doSelect = async (device: DeviceRecord) => {
    await projectStore.setDefaultDevice(device)
}

</script>

<template>
    <a-dropdown v-if="projectStore.current">
        <a-button>
            <div v-if="!selectedDevice">
                <div class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                选择设备
                <icon-caret-down/>
            </div>
            <div v-else>
                <div v-if="selectedDevice.status===EnumDeviceConnectStatus.ConnectSuccess"
                     class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                <div v-else class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                {{ selectedDevice.title }}
                <icon-caret-down/>
            </div>
        </a-button>
        <template #content>
            <a-dgroup title="已连接设备" v-if="devicesConnected.length>0">
                <a-doption v-for="(d,dIndex) in devicesConnected" class="block">
                    <template #default>
                        <div class="p-1 flex items-center">
                            <div class="flex-grow pr-2" @click="doSelect(d)">
                                <div class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                {{ d.title }}
                            </div>
                            <a-button size="mini" @click="infoDialog?.show(d)">
                                <template #icon>
                                    <icon-settings/>
                                </template>
                            </a-button>
                        </div>
                    </template>
                </a-doption>
            </a-dgroup>
            <a-dgroup title="未连接设备" v-if="devicesDisconnected.length>0">
                <a-doption v-for="(d,dIndex) in devicesDisconnected" class="block">
                    <template #default>
                        <div class="p-1 flex items-center">
                            <div class="flex-grow pr-2" @click="doSelect(d)">
                                <div class="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
                                {{ d.title }}
                            </div>
                            <a-button size="mini" @click="infoDialog?.show(d)">
                                <template #icon>
                                    <icon-settings/>
                                </template>
                            </a-button>
                        </div>
                    </template>
                </a-doption>
            </a-dgroup>
        </template>
    </a-dropdown>
    <DeviceInfoDialog ref="infoDialog"/>
</template>

<style scoped>

</style>

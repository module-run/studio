<script setup lang="ts">
import {ref} from 'vue';
import DeviceEditDialog from "../components/DeviceEditDialog.vue";
import {EnumDeviceType} from "../types/Device";
import {useDeviceStore} from "../store/modules/device";
import {Dialog} from "../lib/dialog";
import DeviceConnectStatus from "../components/DeviceConnectStatus.vue";
import DeviceInfoDialog from "../components/DeviceInfoDialog.vue";

const deviceStore = useDeviceStore()
const editDialog = ref<InstanceType<typeof DeviceEditDialog> | null>(null);
const infoDialog = ref<InstanceType<typeof DeviceInfoDialog> | null>(null);

const doDelete = (index: number) => {
    Dialog.confirm('确定删除吗？').then(() => {
        deviceStore.delete(index)
    })
}

const doRefresh = (index: number) => {
    deviceStore.reconnect(index)
}

const doInfo = (index: number) => {
    infoDialog.value?.show(deviceStore.records[index])
}

const doEdit = (index: number) => {
    editDialog.value?.edit(index)
}

const doCreate = () => {
    editDialog.value?.add();
}

</script>

<template>
    <div class="p-8">
        <div class="text-3xl font-bold mb-4">
            设备
        </div>
        <div class="-mx-2">
            <div v-if="!deviceStore.records.length" class="py-20">
                <div class="mb-6">
                    <a-empty description="还没有设备，快去添加一个吧"/>
                </div>
                <div class="text-center">
                    <a-button type="primary" @click="doCreate()">
                        <icon-plus class="mr-1"/>
                        添加设备
                    </a-button>
                </div>
            </div>
            <div v-else class="flex flex-wrap">
                <div v-for="(r,rIndex) in deviceStore.records" :key="rIndex"
                     class="p-2 w-1/3 2xl:w-1/4">
                    <div
                        class="hover:shadow-lg shadow border border-solid h-48 border-gray-100 rounded-lg flex flex-col p-3">
                        <div class="flex-grow flex">
                            <div class="flex-grow">
                                <div class="font-bold truncate cursor-pointer mb-2">
                                    {{ r.title }}
                                </div>
                                <div class="text-gray-400 text-sm">
                                    <icon-info-circle class="mr-1"/>
                                    {{ r.addr + ':' + r.port }}
                                </div>
                            </div>
                            <div>
                                <DeviceConnectStatus :status="r.status"/>
                            </div>
                        </div>
                        <div class="flex items-end pt-4">
                            <div class="flex-grow relative">
                                <div class="cursor-pointer" @click="doInfo(rIndex)">
                                    <img v-if="r.type===EnumDeviceType.RaspberryPi"
                                         src="./../assets/device/RaspberryPi_5B.svg"
                                         class="w-24 h-24 bg-gray-100 rounded"/>
                                </div>
                            </div>
                            <div>
                                <a-button class="mr-1" @click="doRefresh(rIndex)">
                                    <template #icon>
                                        <icon-refresh class="text-gray-400"/>
                                    </template>
                                </a-button>
                                <a-dropdown>
                                    <a-button>
                                        <template #icon>
                                            <icon-settings class="text-gray-400"/>
                                        </template>
                                    </a-button>
                                    <template #content>
                                        <a-doption @click="doEdit(rIndex)">修改</a-doption>
                                        <a-doption @click="doDelete(rIndex)">删除</a-doption>
                                    </template>
                                </a-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-2 w-1/3 2xl:w-1/4">
                    <div
                        class="hover:shadow-lg shadow border h-48 border-solid flex flex-col justify-center border-gray-100 rounded-lg p-3 cursor-pointer"
                        @click="doCreate()">
                        <div class="text-center text-gray-600">
                            <div>
                                <icon-plus-circle class="text-3xl text-gray-400"/>
                            </div>
                            <div>
                                添加设备
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <DeviceEditDialog ref="editDialog"/>
    <DeviceInfoDialog ref="infoDialog"/>
</template>

<style scoped>

</style>

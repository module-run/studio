<script setup lang="ts">

import {onMounted, ref} from "vue";
import {ExtendStoreService} from "../services/ExtendStoreService";
import {ProjectExtendRecord} from "../types/Project";
import ExtendDetailDialog from "./ExtendDetailDialog.vue";
import {useProjectStore} from "../store/modules/project";

const extendDetailDialog = ref<InstanceType<typeof ExtendDetailDialog> | null>(null);
const extendList = ref<ProjectExtendRecord[]>([]);
const loading = ref(true);
const projectStore = useProjectStore()

onMounted(async () => {
    extendList.value = await ExtendStoreService.list()
    loading.value = false
})

const isInstalled = (name: string) => {
    return projectStore.currentExtends?.findIndex(e => e.name === name) !== -1 || false
}

</script>

<template>
    <div v-if="0" class="mb-3">
        <a-button type="outline">
            <div class="">
                全部
            </div>
        </a-button>
        <a-button v-for="i in 0" type="text">
            <div class="text-black">
                树莓派
            </div>
        </a-button>
    </div>
    <div style="height:60vh;" class="overflow-y-auto">
        <m-loading v-if="loading"/>
        <m-empty v-if="!loading && extendList.length === 0"/>
        <div v-for="e in extendList">
            <div class="border-b border-solid border-gray-100 p-3 rounded-lg hover:bg-gray-100">
                <div class="flex items-center">
                    <img :src="e.logo" class="w-10 p-1 rounded-lg bg-gray-100 mr-2"/>
                    <div class="flex-grow cursor-pointer"
                         @click="extendDetailDialog?.show(e)">
                        <div class="font-bold">{{ e.title }}</div>
                        <div class="text-sm text-gray-400">{{ e.description }}</div>
                    </div>
                    <div class="px-2">
                        <a-tag v-if="isInstalled(e.name)" color="green">
                            <template #icon>
                                <icon-check-circle-fill/>
                            </template>
                            已安装
                        </a-tag>
                    </div>
                    <div class="w-20">
                        <a-button @click="extendDetailDialog?.show(e)">
                            查看
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ExtendDetailDialog ref="extendDetailDialog"/>
</template>


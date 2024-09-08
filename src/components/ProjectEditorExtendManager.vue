<script setup lang="ts">

import ExtendDetailDialog from "./ExtendDetailDialog.vue";
import ExtendManagerDialog from "./ExtendManagerDialog.vue";
import {ref} from "vue";
import {useProjectStore} from "../store/modules/project";

const managerDialog = ref<InstanceType<typeof ExtendManagerDialog> | null>(null);
const detailDialog = ref<InstanceType<typeof ExtendDetailDialog> | null>(null);
const projectStore = useProjectStore()

</script>

<template>
    <div class="p-3 flex items-center">
        <div class="flex-grow">
            <a href="javascript:;"
               class="bg-gray-100 rounded-full leading-8 px-4 inline-block text-gray-600 text-base">
                已安装
            </a>
        </div>
        <div>
            <a-tooltip content="扩展管理">
                <a-button type="text"
                          @click="managerDialog?.show()">
                    <template #icon>
                        <i class="iconfont icon-store-add text-gray-400"></i>
                    </template>
                </a-button>
            </a-tooltip>
        </div>
    </div>
    <div class="px-3">
        <div v-if="!projectStore.currentExtends.length" class="py-10">
            <a-empty description="暂无扩展"/>
        </div>
        <div v-for="e in projectStore.currentExtends"
             class="flex rounded-lg p-2 border border-gray-100 border-solid mb-3 items-center hover:shadow">
            <div class="mr-2">
                <i class="iconfont icon-extend text-extend text-lg"></i>
            </div>
            <div class="flex-grow text-base cursor-pointer"
                 @click="detailDialog?.show(e)">
                {{ e.title }}
            </div>
            <div class="text-gray-400 text-sm mr-2">v{{ e.version }}</div>
        </div>
    </div>
    <ExtendManagerDialog ref="managerDialog"/>
    <ExtendDetailDialog ref="detailDialog"/>
</template>

<style scoped>

</style>

<script setup lang="ts">

import PipDetailDialog from "./PipDetailDialog.vue";
import PipAddDialog from "./PipAddDialog.vue";
import {ref} from "vue";
import {useProjectStore} from "../store/modules/project";
import {ProjectPipRecord} from "../types/Project";
import {Dialog} from "../lib/dialog";

const projectStore = useProjectStore()
const addDialog = ref<InstanceType<typeof PipAddDialog> | null>(null);
const detailDialog = ref<InstanceType<typeof PipDetailDialog> | null>(null);

const doDelete = (pip: ProjectPipRecord) => {
    Dialog.confirm('确定删除吗？')
        .then(async () => {
            await projectStore.deletePipDependency(pip)
            Dialog.tipSuccess('删除成功')
        })
}

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
            <a-button type="text"
                      @click="addDialog?.show()">
                <template #icon>
                    <icon-plus class="text-gray-400 text-lg"/>
                </template>
            </a-button>
        </div>
    </div>
    <div class="px-3">
        <div v-if="!projectStore.current?.pipDependencies || !projectStore.current?.pipDependencies.length">
            <a-empty description="还没有依赖"/>
        </div>
        <div v-for="(p,pIndex) in projectStore.current?.pipDependencies"
             class="flex rounded-lg p-2 border border-gray-100 border-solid mb-3 items-center hover:shadow">
            <div class="mr-2">
                <i class="iconfont icon-pip text-pip text-lg"></i>
            </div>
            <div class="flex-grow text-base cursor-pointer font-mono mr-2"
                 @click="detailDialog?.show(p)">
                {{ p.name }}
            </div>
            <div class="text-gray-400 text-sm mr-2">
                {{ p.version }}
            </div>
            <div>
                <a-dropdown>
                    <a-button type="text">
                        <template #icon>
                            <icon-settings class="text-gray-400"/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption class="text-red-400" @click="doDelete(p)">删除</a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
    <PipAddDialog ref="addDialog"/>
    <PipDetailDialog ref="detailDialog"/>
</template>

<style scoped>

</style>

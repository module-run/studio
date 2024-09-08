<script setup lang="ts">
import {useProjectStore} from "../store/modules/project";
import {ProjectModuleRecord} from "../types/Project";
import {Dialog} from "../lib/dialog";
import ProjectModuleEditDialog from "./ProjectModuleEditDialog.vue";
import {ref} from "vue";

const editDialog = ref<typeof ProjectModuleEditDialog>()
const projectStore = useProjectStore()

const doDelete = (m: ProjectModuleRecord) => {
    if (projectStore.currentModules.length <= 1) {
        Dialog.tipError('至少保留一个模块')
        return
    }
    Dialog.confirm('确定删除该模块吗？')
        .then(() => {
            projectStore.deleteModule(m)
        })
}

const doEdit = (m: ProjectModuleRecord) => {
    editDialog.value?.show(m)
}
</script>

<template>
    <div class="px-3">
        <div v-for="m in projectStore.currentModules"
             class="flex rounded-lg px-2 py-1 border border-gray-100 border-solid mb-1 items-center hover:shadow"
             @click="projectStore.activeModule(m)"
             :class="projectStore.currentModuleActive===m.name?'bg-gray-100':''">
            <div class="mr-2">
                <i class="iconfont icon-module text-primary text-lg"></i>
            </div>
            <div class="flex-grow text-base cursor-pointer">
                {{ m.title }}
            </div>
            <div>
                <a-dropdown>
                    <a-button type="text">
                        <template #icon>
                            <icon-settings class="text-gray-400"/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption @click="doEdit(m)">
                            修改
                        </a-doption>
                        <a-doption class="text-red-500"
                                   @click="doDelete(m)">
                            删除
                        </a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
    <ProjectModuleEditDialog ref="editDialog"/>
</template>

<style scoped>

</style>

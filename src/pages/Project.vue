<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import ProjectCreateDialog from "../components/ProjectCreateDialog.vue";
import {EnumProjectType, ProjectRecord} from "../types/Project";
import {Dialog} from "../lib/dialog";
import ProjectEditDialog from "../components/ProjectEditDialog.vue";
import ProjectCreateGuide from "../components/ProjectCreateGuide.vue";
import {useProjectStore} from "../store/modules/project";
import {TimeUtil} from "../lib/util";

const projectStore = useProjectStore()
const router = useRouter()

const projectCreateDialog = ref()
const projectEditDialog = ref()
const doCreate = () => {
    projectCreateDialog.value.show()
}

const doEdit = (project: ProjectRecord) => {
    projectEditDialog.value.show(project.id)
}

const doDelete = (project: ProjectRecord) => {
    Dialog.confirm('确定删除项目吗？')
        .then(async () => {
            await projectStore.delete(project)
            Dialog.tipSuccess('删除成功')
        })
}
const doProjectOpen = (project: ProjectRecord) => {
    router.push({
        path: '/project_editor',
        query: {id: project.id}
    })
}

</script>

<template>
    <div class="p-8">
        <div class="text-3xl font-bold mb-4">
            项目
        </div>
        <div class="-mx-2">
            <div v-if="!projectStore.records.length" class="py-20">
                <div class="mb-6">
                    <a-empty description="还没有项目，快去创建一个吧"/>
                </div>
                <div class="mx-auto" style="max-width:50rem;">
                    <ProjectCreateGuide/>
                </div>
            </div>
            <div v-else class="flex flex-wrap">
                <div v-for="(p,pIndex) in projectStore.records" :key="pIndex"
                     class="p-2 w-1/3 2xl:w-1/4">
                    <div
                        class="hover:shadow-lg shadow border border-solid h-32 border-gray-100 rounded-lg flex flex-col p-3">
                        <div class="flex-grow flex">
                            <img v-if="p.type===EnumProjectType.Blockly"
                                 src="./../assets/image/blockly.svg"
                                 @click="doProjectOpen(p)"
                                 class="w-14 h-14 rounded-lg bg-gray-100 p-2 mr-2"/>
                            <img v-if="p.type===EnumProjectType.Python"
                                 src="./../assets/image/python.svg"
                                 @click="doProjectOpen(p)"
                                 class="w-14 h-14 rounded-lg bg-gray-100 p-2 mr-2"/>
                            <div class="flex-grow">
                                <div class="font-bold truncate cursor-pointer mb-2"
                                     @click="doProjectOpen(p)">
                                    {{ p.title }}
                                </div>
                                <div class="text-gray-400 text-sm">
                                    <icon-clock-circle class="mr-1"/>
                                    {{ TimeUtil.format(p.updatedAt) }}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="flex-grow">
                            </div>
                            <div>
                                <a-dropdown>
                                    <a-button class="mr-2">
                                        <template #icon>
                                            <icon-settings class="text-gray-400"/>
                                        </template>
                                    </a-button>
                                    <template #content>
                                        <a-doption @click="doEdit(p)">修改</a-doption>
                                        <a-doption @click="doDelete(p)">删除</a-doption>
                                    </template>
                                </a-dropdown>
                                <a-button @click="doProjectOpen(p)">
                                    <icon-folder class="mr-1"/>
                                    打开
                                </a-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-2 w-1/3 2xl:w-1/4">
                    <div
                        class="hover:shadow-lg shadow border h-32 border-solid flex flex-col justify-center border-gray-100 rounded-lg p-3 cursor-pointer"
                        @click="doCreate()">
                        <div class="text-center text-gray-600">
                            <div>
                                <icon-plus-circle class="text-3xl text-gray-400"/>
                            </div>
                            <div>
                                新建项目
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ProjectCreateDialog ref="projectCreateDialog"/>
    <ProjectEditDialog ref="projectEditDialog"/>
</template>

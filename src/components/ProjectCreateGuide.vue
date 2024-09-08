<script setup lang="ts">
import {EnumProjectType} from "../types/Project";
import ProjectCreateDialog from "./ProjectCreateDialog.vue";
import {ref} from "vue";

const projectCreateDialog = ref<InstanceType<typeof ProjectCreateDialog> | null>(null);
const doProjectCreate = (type: EnumProjectType) => {
    projectCreateDialog.value?.show(type);
};
</script>

<template>
    <div class="flex">
        <div class="w-1/2 px-2 flex-grow">
            <div
                class="bg-gray-100 rounded-lg flex items-start p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl">
                <img class="w-12 h-12 mr-2" src="./../assets/image/blockly.svg"/>
                <div>
                    <div class="mb-2">可视化项目</div>
                    <div class="text-gray-400 text-sm mb-4">
                        提供可视化编辑器，无需编程即可完成开发
                    </div>
                    <div>
                        <a-button type="primary" @click="doProjectCreate(EnumProjectType.Blockly)">
                            <icon-plus class="mr-1"/>
                            立即创建
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-1/2 px-2 flex-grow">
            <div
                class="bg-gray-100 rounded-lg flex items-start p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl">
                <img class="w-12 h-12 mr-2" src="./../assets/image/python.svg"/>
                <div>
                    <div class="mb-2">专业项目</div>
                    <div class="text-gray-400 text-sm mb-4">
                        提供专业编辑器，支持 Python 语言开发流程
                    </div>
                    <div>
                        <a-button type="primary" @click="doProjectCreate(EnumProjectType.Python)">
                            <icon-plus class="mr-1"/>
                            立即创建
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ProjectCreateDialog ref="projectCreateDialog"/>
</template>

<style scoped>

</style>

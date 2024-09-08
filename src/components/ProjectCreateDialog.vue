<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {EnumProjectType, ProjectRecord} from "../types/Project";
import {useProjectStore} from "../store/modules/project";
import {Dialog} from "../lib/dialog";

const projectStore = useProjectStore()

const route = useRouter()
const visible = ref(false)
const createData = ref({
    type: EnumProjectType.Blockly,
    title: '',
} as ProjectRecord)
const show = (type: EnumProjectType = EnumProjectType.Blockly) => {
    createData.value.type = type
    visible.value = true
}
const doSubmit = async () => {
    if (!createData.value.title) {
        Dialog.tipError('请输入项目名称');
        return
    }
    const record = await projectStore.add(createData.value)
    Dialog.tipSuccess('创建成功')
    route.push('/project_editor?id=' + record.id)
}
const doCancel = () => {
    visible.value = false
}
defineExpose({
    show
})
</script>

<template>
    <a-modal v-model:visible="visible"
             width="50rem"
             title-align="start">
        <template #title>
            创建项目
        </template>
        <template #footer>
            <a-button type="primary"
                      @click="doSubmit">
                创建项目
            </a-button>
        </template>
        <div>
            <div class="flex">
                <div class="w-1/2 px-2 flex-grow">
                    <div @click="createData.type = EnumProjectType.Blockly"
                         class="border-2 border-solid border-gray-200 bg-gray-100 rounded-lg flex items-start p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow cursor-pointer relative"
                         :class="{'border-red-400': createData.type === EnumProjectType.Blockly}">
                        <img class="w-12 h-12 mr-2" src="./../assets/image/blockly.svg"/>
                        <div>
                            <div class="mb-2">可视化项目</div>
                            <div class="text-gray-400 text-sm mb-4 truncate">
                                可视化编辑器，无需编程即可完成开发
                            </div>
                        </div>
                        <div v-if="createData.type === EnumProjectType.Blockly" class="absolute bottom-1 right-2">
                            <icon-check-circle class="text-2xl text-red-600"/>
                        </div>
                    </div>
                </div>
                <div class="w-1/2 px-2 flex-grow">
                    <div @click="createData.type = EnumProjectType.Python"
                         class="border-2 border-solid border-gray-200 bg-gray-100 rounded-lg flex items-start p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow cursor-pointer relative"
                         :class="{'border-red-400': createData.type === EnumProjectType.Python}">
                        <img class="w-12 h-12 mr-2" src="./../assets/image/python.svg"/>
                        <div>
                            <div class="mb-2">专业项目</div>
                            <div class="text-gray-400 text-sm mb-4 truncate">
                                专业编辑器，支持 Python 语言开发流程
                            </div>
                        </div>
                        <div v-if="createData.type === EnumProjectType.Python" class="absolute bottom-1 right-2">
                            <icon-check-circle class="text-2xl text-red-600"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-2 pt-6">
                <a-form :model="createData" layout="vertical">
                    <a-form-item label="项目名称">
                        <a-input v-model="createData.title"
                                 placeholder="请输入项目名称"/>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </a-modal>
</template>


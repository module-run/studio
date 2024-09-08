<script setup lang="ts">
import {ref} from "vue";
import {Dialog} from "../lib/dialog";
import {ProjectRecord} from "../types/Project";
import {useProjectStore} from "../store/modules/project";

const projectStore = useProjectStore()
const visible = ref(false)
const editData = ref<ProjectRecord>({
    id: '',
    title: '',
} as ProjectRecord)
const show = (id: string) => {
    const project = projectStore.getById(id)
    if (!project) {
        Dialog.tipError('项目不存在')
        return
    }
    editData.value.id = project.id
    editData.value.title = project.title
    visible.value = true
}
const doSubmit = async () => {
    await projectStore.edit(editData.value)
    Dialog.tipSuccess('修改成功')
    visible.value = false
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
             title-align="start">
        <template #title>
            修改项目
        </template>
        <template #footer>
            <a-button @click="doCancel">
                取消
            </a-button>
            <a-button type="primary"
                      @click="doSubmit">
                保存
            </a-button>
        </template>
        <div>
            <div class="px-2 ">
                <a-form :model="editData" layout="vertical">
                    <a-form-item label="项目名称">
                        <a-input v-model="editData.title"
                                 placeholder="请输入项目名称"/>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </a-modal>
</template>


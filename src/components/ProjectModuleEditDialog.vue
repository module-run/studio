<script setup lang="ts">
import {ref} from "vue";
import {Dialog} from "../lib/dialog";
import {ProjectModuleRecord} from "../types/Project";
import {useProjectStore} from "../store/modules/project";
import {pick} from "lodash-es";

const projectStore = useProjectStore()
const visible = ref(false)
const nameOld = ref('')
const editData = ref<ProjectModuleRecord>({
    name: '',
    title: '',
} as ProjectModuleRecord)
const show = (module: ProjectModuleRecord) => {
    nameOld.value = module.name
    editData.value = pick(module, [
        'name', 'title'
    ]) as ProjectModuleRecord
    visible.value = true
}
const doSubmit = () => {
    projectStore.editModuleName(nameOld.value, editData.value.name)
        .then(() => projectStore.editModule(editData.value))
        .then(() => {
            Dialog.tipSuccess('修改成功')
            visible.value = false
        })
        .catch(msg => {
            Dialog.tipError(msg)
        })
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
            修改模块
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
                    <a-form-item label="模块标识">
                        <a-input v-model="editData.name"
                                 placeholder=""/>
                    </a-form-item>
                    <a-form-item label="模块名称">
                        <a-input v-model="editData.title"
                                 placeholder=""/>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </a-modal>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {Dialog} from "../lib/dialog";
import {useProjectStore} from "../store/modules/project";
import {ProjectPipRecord} from "../types/Project";

const projectStore = useProjectStore()
const visible = ref(false)
const addData = ref<ProjectPipRecord>({
    name: '',
    version: '',
} as ProjectPipRecord)
const show = () => {
    addData.value.name = ''
    addData.value.version = ''
    visible.value = true
}
const doSubmit = async () => {
    if (!addData.value.name) {
        Dialog.tipError('请输入名称')
        return
    }
    if (projectStore.current?.pipDependencies) {
        if (projectStore.current?.pipDependencies.find(p => p.name === addData.value.name)) {
            Dialog.tipError('已存在相同名称的依赖')
            return
        }
    }
    Dialog.loadingOn('正在安装')
    await projectStore.addPipDependency(addData.value)
    visible.value = false
    Dialog.loadingOff()
    Dialog.tipSuccess('安装成功')
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
            添加 pip 依赖
        </template>
        <template #footer>
            <a-button key="back" @click="doCancel">
                取消
            </a-button>
            <a-button key="submit" type="primary" @click="doSubmit">
                安装
            </a-button>
        </template>
        <div>
            <div class="px-2">
                <a-form :model="addData">
                    <a-form-item label="名称" required>
                        <a-input v-model="addData.name"/>
                        <template #extra>
                            <div>
                                请输入有效的 pip 依赖名称，可从
                                <a href="https://pypi.org" target="_blank">https://pypi.org</a>
                                检索。
                            </div>
                        </template>
                    </a-form-item>
                    <a-form-item label="版本">
                        <a-input v-model="addData.version"/>
                    </a-form-item>
                </a-form>
            </div>

        </div>
    </a-modal>
</template>


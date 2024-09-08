<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import 'blockly/blocks';
import {useProjectStore} from "../../store/modules/project";
import {BlocklyManager} from "./blockly/manager";
import {UI} from "../../lib/ui";
import {ProjectModuleDataRecord} from "../../types/Project";
import CodeViewerDialog from "../common/CodeViewerDialog.vue";

const projectStore = useProjectStore()
const blocklyManager = new BlocklyManager()
const blockContainer = ref<HTMLDivElement | null>(null)
const codeViewerDialog = ref<InstanceType<typeof CodeViewerDialog> | null>(null)

const windowResizer = () => {
    blocklyManager?.resize()
}

onMounted(() => {
    blocklyManager.init(blockContainer.value)
    blocklyManager.on('change', async (manager: BlocklyManager) => {
        const data = {
            codePy: manager.getCodeBlocksPy(),
            blocklyJson: JSON.stringify(manager.getValue())
        } as ProjectModuleDataRecord
        // console.log('change', data)
        await projectStore.editModuleData(data)
    })
    UI.onResize(blockContainer.value, windowResizer)
})

onBeforeUnmount(() => {
    UI.offResize(blockContainer.value)
    blocklyManager.destroy()
})

watch(() => projectStore.currentModuleActiveData, (newVal) => {
    if (!newVal) {
        return
    }
    let json
    try {
        json = JSON.parse(newVal.blocklyJson)
    } catch (e) {
    }
    blocklyManager.setValue(json as Object || {})
    // console.log('projectStore.currentModuleActiveData', JSON.stringify(newVal))
})

watch(() => projectStore.currentModules, (newVal) => {
    if (!newVal) {
        return
    }
    // console.log('projectStore.currentModules', JSON.stringify(newVal))
})

watch(() => projectStore.currentExtends, (newVal) => {
    if (!newVal) {
        return
    }
    // console.log('projectStore.currentExtends', JSON.stringify(newVal))
    blocklyManager.updateToolbox([])
    blocklyManager.update()
})

const showCode = () => {
    codeViewerDialog.value?.show(blocklyManager.getCodeBlocksPy())
}

defineExpose({
    showCode
})

</script>

<template>
    <div class="pb-blockly-container" :style="{'height':'100%','width':'100%','border':'1px solid lightgray'}">
        <div class="mx-auto h-full" ref="blockContainer"></div>
    </div>
    <CodeViewerDialog ref="codeViewerDialog"/>
</template>

<style lang="less">
@import "./blockly/style";
</style>




<script setup lang="ts">
import {ref} from "vue";
import ExtendDetailDialog from "./ExtendDetailDialog.vue";
import ExtendManagerDialogLocal from "./ExtendManagerDialogLocal.vue";
import ExtendManagerDialogStore from "./ExtendManagerDialogStore.vue";
import ExtendManagerDialogUpload from "./ExtendManagerDialogUpload.vue";

const visible = ref(false)
const tab = ref('store')

const show = () => {
    visible.value = true
}
const doOk = () => {
    visible.value = false
}
const doSwitchTab = (tabName: string) => {
    tab.value = tabName
}
const extendDetailDialog = ref<InstanceType<typeof ExtendDetailDialog>>()
defineExpose({
    show
})
</script>

<template>
    <a-modal v-model:visible="visible"
             width="90vw"
             title-align="start"
             :footer="false">
        <template #title>
            扩展市场
        </template>
        <div class="flex">
            <div class="w-48 flex-shrink-0 border-r border-solid border-gray-200 pr-3">
                <div class="leading-8 rounded-lg px-3 py-2 cursor-pointer"
                     @click="doSwitchTab('store')"
                     :class="tab==='store'?'bg-gray-100 font-bold':''">
                    <icon-apps class="mr-2" :class="{'text-primary':tab==='store'}"/>
                    全部扩展
                </div>
                <div class="leading-8 rounded-lg px-3 py-2 cursor-pointer"
                     @click="doSwitchTab('local')"
                     :class="tab==='local'?'bg-gray-100 font-bold':''">
                    <icon-folder class="mr-2" :class="{'text-primary':tab==='local'}"/>
                    已安装扩展
                </div>
                <div class="leading-8 rounded-lg px-3 py-2 cursor-pointer"
                     @click="doSwitchTab('upload')"
                     :class="tab==='upload'?'bg-gray-100 font-bold':''">
                    <icon-upload class="mr-2" :class="{'text-primary':tab==='upload'}"/>
                    导入本地扩展
                </div>
            </div>
            <div class="px-2 flex-grow">
                <div v-if="tab==='store'">
                    <ExtendManagerDialogStore/>
                </div>
                <div v-if="tab==='local'">
                    <ExtendManagerDialogLocal/>
                </div>
                <div v-if="tab==='upload'">
                    <ExtendManagerDialogUpload/>
                </div>
            </div>
        </div>
    </a-modal>
    <ExtendDetailDialog ref="extendDetailDialog"/>
</template>


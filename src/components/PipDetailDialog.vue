<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import {ProjectPipRecord} from "../types/Project";
import {Dialog} from "../lib/dialog";
import {useProjectStore} from "../store/modules/project";

const projectStore = useProjectStore()
const visible = ref(false)
const detailData = ref({
    name: '',
    version: '',
    cover: '',
    title: '',
    desc: '',
    content: '',
    orgUrl: '',
})
const webviewVisible = ref(false)
const webviewPreload = ref('')
const show = (pip: ProjectPipRecord) => {
    detailData.value.name = pip.name
    detailData.value.version = pip.version
    detailData.value.orgUrl = 'https://pypi.org/project/' + pip.name
    detailData.value.title = pip.name
    detailData.value.desc = pip.name + ' ' + pip.version
    detailData.value.content = pip.name + ' ' + pip.version + ' ' + 'pip详细介绍'
    visible.value = true
    webviewVisible.value = false
    nextTick(() => {
        const webview = document.getElementById("pipDetailWebview") as any;
        if (webview) {
            webview.addEventListener('dom-ready', () => {
                console.log('dom-ready')
                let css: string[] = []
                css.push(`header{display:none !important;}`)
                css.push(`footer{display:none !important;}`)
                css.push(`.mobile-search{display:none !important;}`)
                css.push(`#content .banner{display:none !important;}`)
                css.push(`#content .horizontal-section{display:none !important;}`)
                css.push(`#content nav{display:none !important;}`)
                css.push(`.language-switcher{display:none !important;}`)
                css.push(`.sponsors{display:none !important;}`)
                webview.insertCSS(css.join(''))
                webviewVisible.value = true
            })
        }
    })
}
const doDelete = () => {
    Dialog.confirm('确定删除吗？')
        .then(async () => {
            await projectStore.deletePipDependency({
                name: detailData.value.name,
                version: detailData.value.version,
            } as ProjectPipRecord)
            Dialog.tipSuccess('删除成功')
            visible.value = false
        })
}
watch(visible, (v) => {
    if (!v) {
        webviewVisible.value = false
    }
})
onMounted(async () => {
    const p = await window.$mapi.app.extraPathResolve('common/preload/pip.js')
    webviewPreload.value = `file:${p}`
})
defineExpose({
    show
})
</script>

<template>
    <a-modal v-model:visible="visible"
             width="50rem"
             title-align="start"
             :footer="false">
        <template #title>
            pip依赖详情
        </template>
        <div>
            <div class="flex">
                <img v-if="detailData.cover"
                     class="w-20 h-20 mr-4 rounded-lg bg-gray-100 p-2" :src="detailData.cover"/>
                <img v-else
                     class="w-20 h-20 mr-4 rounded-lg bg-gray-100 p-2" src="./../assets/image/python.svg"/>
                <div>
                    <div class="text-lg font-bold mb-4">
                        {{ detailData.title }}
                        <a-tag class="mr-1">{{ detailData.name }}</a-tag>
                        <a-tag>v{{ detailData.version }}</a-tag>
                    </div>
                    <div v-if="0" class="mb-4">
                        {{ detailData.desc }}
                    </div>
                    <div>
                        <a-button type="primary" status="danger" class="align-top mr-2"
                                  @click="doDelete">
                            <icon-delete class="mr-1"/>
                            删除
                        </a-button>
                        <a :href="detailData.orgUrl"
                           class="arco-btn arco-btn-shape-square arco-btn-size-medium align-top mr-2" target="_blank">
                            <icon-book class="mr-1"/>
                            官方文档
                        </a>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <a-tabs default-active-key="content">
                    <a-tab-pane key="content" title="pip介绍">
                        <div v-if="!!detailData.orgUrl" class="bg-gray-100 relative">
                            <webview id="pipDetailWebview"
                                     disablewebsecurity
                                     :src="detailData.orgUrl"
                                     :preload="webviewPreload"
                                     :style="{visibility:webviewVisible?'visible':'hidden'}"
                                     style="width:100%;height:40vh;border:none;"></webview>
                            <div v-if="!webviewVisible" class="absolute inset-0">
                                <m-loading/>
                            </div>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </a-modal>
</template>


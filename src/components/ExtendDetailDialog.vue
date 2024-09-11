<script setup lang="ts">
import {computed, ref} from "vue";
import {ProjectExtendRecord} from "../types/Project";
import {ExtendStoreService} from "../services/ExtendStoreService";
import {useProjectStore} from "../store/modules/project";
import {Dialog} from "../lib/dialog";
import HtmlViewer from "./common/HtmlViewer.vue";

const projectStore = useProjectStore()
const visible = ref(false)
const loading = ref(true)
const extend = ref<ProjectExtendRecord | null>(null)
const extendData = ref<{
    content: string,
    versions: {
        version: string,
        time: string,
        summary: string,
        content: string,
    }[],
}>()

const installedVersion = computed(() => {
    return projectStore.currentExtends.find(o => o.name === extend.value?.name)?.version || null
})

const latestVersion = computed(() => {
    return extendData.value?.versions[0]?.version || null
})

const show = async (record: ProjectExtendRecord) => {
    visible.value = true
    loading.value = true
    extend.value = record
    const data = await ExtendStoreService.getDetail(record.name)
    data.versions.map(o => {
        o._showContent = false
        return o
    })
    extendData.value = data as any
    loading.value = false
}

const doInstall = async (version?: string) => {
    try {
        Dialog.loadingOn()
        version = version || extendData.value?.versions[0].version
        const data = await ExtendStoreService.getData(extend.value?.name as string, version as string)
        await projectStore.addExtend(data.config, data.files)
        Dialog.tipSuccess('安装成功')
        visible.value = false
    } catch (e) {
        console.log('ExtendDetailDialog.doInstall.error', e)
        Dialog.tipError(e as string)
    } finally {
        Dialog.loadingOff()
    }
}

const doDelete = async () => {
    await Dialog.confirm('确定要删除该扩展吗？')
    await projectStore.deleteExtend(extend.value as ProjectExtendRecord)
    Dialog.tipSuccess('删除成功')
    visible.value = false
}

const doUpgrade = async () => {
    await Dialog.confirm('确定要更新该扩展吗？')
    await projectStore.deleteExtend(extend.value as ProjectExtendRecord)
    await doInstall(latestVersion.value as string)
}

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
            扩展详情
        </template>
        <div style="height:70vh;">
            <div class="flex">
                <img v-if="extend?.logo"
                     class="w-20 h-20 mr-4 rounded-lg bg-gray-100 p-2" :src="extend?.logo"/>
                <img v-else
                     class="w-20 h-20 mr-4 rounded-lg bg-gray-100 p-2" src="./../assets/image/extend.svg"/>
                <div>
                    <div class="text-lg font-bold mb-4">
                        {{ extend?.title }}
                        <a-tag>{{ extend?.name }}</a-tag>
                    </div>
                    <div class="mb-4">
                        {{ extend?.description }}
                    </div>
                    <div>
                        <a-button v-if="loading">
                            加载中...
                        </a-button>
                        <div v-if="!projectStore.current">
                            <a-button>
                                <template #icon>
                                    <icon-info-circle/>
                                </template>
                                创建项目后安装
                            </a-button>
                        </div>
                        <div v-else>
                            <a-button v-if="!loading&&!installedVersion"
                                      :loading="loading"
                                      type="primary" class="align-top mr-2"
                                      @click="doInstall()">
                                <icon-plus class="mr-1"/>
                                安装
                            </a-button>
                            <a-button v-else-if="!loading"
                                      type="primary" status="danger"
                                      class="align-top mr-2"
                                      @click="doDelete()">
                                <icon-delete class="mr-1"/>
                                删除
                            </a-button>
                            <a-button v-if="!loading && installedVersion && installedVersion !== latestVersion"
                                      type="primary" class="align-top mr-2"
                                      @click="doUpgrade()">
                                <icon-up class="mr-1"/>
                                更新到 v{{ latestVersion }}
                            </a-button>
                            <a-dropdown v-if="!loading && !installedVersion" class="align-top"
                                        :popup-max-height="false">
                                <a-button :loading="loading">
                                    历史版本
                                    <icon-down class="ml-1"/>
                                </a-button>
                                <template #content>
                                    <a-doption v-for="(v,vIndex) in extendData?.versions"
                                               @click="doInstall(v.version)">
                                        {{ v.version }}
                                    </a-doption>
                                </template>
                            </a-dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <a-tabs default-active-key="content">
                    <a-tab-pane key="content" title="扩展介绍">
                        <m-loading v-if="loading"/>
                        <div v-else class="p-4">
                            <HtmlViewer :value="extendData?.content"/>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="history" title="历史版本">
                        <m-loading v-if="loading"/>
                        <div v-else class="p-4 max-h-80 overflow-y-auto">
                            <a-timeline>
                                <a-timeline-item
                                    v-for="(v,vIndex) in extendData?.versions"
                                    :key="vIndex"
                                    :label="v.time">
                                    <div class="flex">
                                        <div class="w-14">
                                            v{{ v.version }}
                                        </div>
                                        <div class="flex-grow">
                                            {{ v.summary }}
                                        </div>
                                        <div>
                                            <a-tooltip content="查看详情">
                                                <icon-file class="cursor-pointer text-gray-400"
                                                           @click="v._showContent = !v._showContent"/>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                    <div v-if="v._showContent" class="text-sm text-gray-500 py-2">
                                        <HtmlViewer :value="v.content"/>
                                    </div>
                                </a-timeline-item>
                            </a-timeline>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </a-modal>
</template>


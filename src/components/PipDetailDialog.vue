<script setup lang="ts">
import {ref} from "vue";
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
const show = (pip: ProjectPipRecord) => {
    detailData.value.name = pip.name
    detailData.value.version = pip.version
    detailData.value.orgUrl = 'https://pypi.org/project/' + pip.name
    detailData.value.title = pip.name
    detailData.value.desc = pip.name + ' ' + pip.version
    detailData.value.content = pip.name + ' ' + pip.version + ' ' + 'pip详细介绍'
    visible.value = true
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
                        <a-tag>{{ detailData.name }}</a-tag>
                    </div>
                    <div class="mb-4">
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
                        <div class="p-4">
                            {{ detailData.content }}
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </a-modal>
</template>


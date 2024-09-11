<script setup lang="ts">
import {AppConfig} from "../config";
import {onMounted, ref} from "vue";
import ExtendDetailDialog from "../components/ExtendDetailDialog.vue";
import ProjectCreateGuide from "../components/ProjectCreateGuide.vue";
import {ProjectExtendRecord} from "../types/Project";
import {ExtendStoreService} from "../services/ExtendStoreService";

const extendList = ref<ProjectExtendRecord[]>([]);
const extendDetailDialog = ref<InstanceType<typeof ExtendDetailDialog> | null>(null);
const loading = ref(true);

onMounted(async () => {
    extendList.value = await ExtendStoreService.list()
    loading.value = false
})

</script>

<template>
    <div class="page-narrow-container p-8">
        <div class="text-3xl font-bold mb-4">
            您好，欢迎使用 {{ AppConfig.name }} ！
        </div>
        <div class="flex">
            <div class="flex-grow">
                <div class="-mx-2">
                    <ProjectCreateGuide/>
                </div>
                <div class="mt-4">
                    <div class="text-lg">扩展</div>
                    <div class="block w-9 h-1 bg-primary rounded-full"></div>
                </div>
                <m-loading v-if="loading"/>
                <m-empty v-if="!loading && extendList.length === 0"/>
                <div class="flex flex-grow flex-wrap -mx-2">
                    <div v-for="e in extendList" class="w-1/3 p-2">
                        <div @click="extendDetailDialog?.show(e)"
                             class="flex items-start bg-gray-50 p-2 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg">
                            <img class="w-12 h-12 mr-2" :src="e.logo"/>
                            <div class="flex-grow w-0">
                                <div class="truncate">
                                    {{ e.title }}
                                </div>
                                <div class="truncate text-gray-400 text-sm">
                                    {{ e.description }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-80 flex-shrink-0 ml-4">
                <div class="bg-blue-50 rounded-lg p-3 mb-4">
                    <div class="mb-4">
                        <div class="text-lg">
                            开源
                            <a-tag color="red">HOT</a-tag>
                        </div>
                        <div class="block w-9 h-1 bg-primary rounded-full"></div>
                    </div>
                    <a :href="AppConfig.websiteGithub"
                       target="_blank"
                       class="bg-white rounded-lg p-2 flex items-center mb-3 hover:shadow-lg">
                        <img src="./../assets/image/github.svg" class="w-12 h-12 mr-2"/>
                        <div class="flex-grow">Github 开源支持</div>
                    </a>
                    <a :href="AppConfig.websiteGitee"
                       target="_blank"
                       class="bg-white rounded-lg p-2 flex items-center hover:shadow-lg">
                        <img src="./../assets/image/gitee.svg" class="w-12 h-12 mr-2"/>
                        <div class="flex-grow">Gitee 开源支持</div>
                    </a>
                </div>
                <div class="rounded-lg bg-gray-100 py-24 text-gray-500 text-center">
                    广告位
                </div>
            </div>
        </div>
    </div>
    <ExtendDetailDialog ref="extendDetailDialog"/>
</template>


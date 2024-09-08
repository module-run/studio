<script setup lang="ts">
import {useProjectStore} from "../store/modules/project";
import ExtendDetailDialog from "./ExtendDetailDialog.vue";
import {ref} from "vue";

const projectStore = useProjectStore();
const extendDetailDialog = ref<InstanceType<typeof ExtendDetailDialog> | null>(null);

</script>

<template>
    <div v-if="0" class="mb-3">
        <a-button type="outline">
            <div class="">
                已安装扩展
            </div>
        </a-button>
    </div>
    <div style="height:50vh;" class="overflow-y-auto">
        <m-empty v-if="!projectStore.currentExtends.length"/>
        <div v-for="e in projectStore.currentExtends">
            <div class="border-b border-solid border-gray-100 p-3 rounded-lg hover:bg-gray-100">
                <div class="flex items-center">
                    <img :src="e.logo" class="w-10 p-1 rounded-lg bg-gray-100 mr-2"/>
                    <div class="flex-grow cursor-pointer"
                         @click="extendDetailDialog?.show(e)">
                        <div class="font-bold">{{ e.title }}</div>
                        <div class="text-sm text-gray-400">{{ e.description }}</div>
                    </div>
                    <div class="w-20">
                        <a-button @click="extendDetailDialog?.show(e)">
                            管理
                        </a-button>
                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>
    </div>
    <ExtendDetailDialog ref="extendDetailDialog"/>
</template>

<style scoped>

</style>

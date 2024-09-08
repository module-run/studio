<script setup lang="ts">
import {computed, nextTick, ref} from "vue";
import {EnumLogType} from "../types/Log";
import {TimeUtil} from "../lib/util";
import {useLogStore} from "../store/modules/log";
import {useProjectStore} from "../store/modules/project";

const projectStore = useProjectStore()
const logStore = useLogStore()
const logContainer = ref<HTMLElement | null>(null);
const isAutoScroll = ref(true);

const logRecords = computed(() => {
    if (isAutoScroll.value) {
        scrollToBottom();
    }
    return logStore.records.filter(r => {
        return r.projectId === projectStore.current?.id || !r.projectId
    })
})

const doAutoScroll = () => {
    isAutoScroll.value = !isAutoScroll.value
    if (isAutoScroll.value) {
        scrollToBottom();
    }
}
const doClear = () => {
    logStore.clearByProjectId(projectStore.current?.id as string)
}

const scrollToBottom = () => {
    nextTick(() => {
        if (logContainer.value) {
            logContainer.value.scrollTop = logContainer.value.scrollHeight
        }
    });
};
</script>

<template>
    <div class="flex absolute inset-0">
        <div class="border-r border-solid border-gray-200">
            <a href="javascript:;"
               @click="doClear"
               class="px-3 py-2 block"
               :class="{'text-gray-200': !logRecords.length,'cursor-not-allowed':!logRecords.length,'hover:text-red-600':logRecords.length}">
                <icon-delete/>
            </a>
            <a href="javascript:;"
               :class="{'text-primary': isAutoScroll}"
               class="px-3 py-2 block hover:text-primary"
               @click="doAutoScroll">
                <icon-to-bottom/>
            </a>
        </div>
        <div class="flex-grow overflow-y-auto" ref="logContainer">
            <div v-if="!logRecords.length" class="py-10">
                <a-empty description="暂无日志"/>
            </div>
            <div v-else class="p-3 text-gray-800">
                <div v-for="(l,lIndex) in logRecords" class="text-sm font-mono pb-1">
                    <span v-if="l.level===EnumLogType.INFO" class="mr-2 text-green-600">消息</span>
                    <span v-else-if="l.level===EnumLogType.ERROR" class="mr-2 text-red-600">错误</span>
                    <span v-else-if="l.level===EnumLogType.WARN" class="mr-2 text-yellow-600">警告</span>
                    <span class="mr-2 text-gray-500">{{ TimeUtil.format(l.time) }}</span>
                    <span class="mr-2 break-all">{{ l.msg }}</span>
                    <span v-if="l.data" class="text-sm text-gray-400 break-all">{{ JSON.stringify(l.data) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>


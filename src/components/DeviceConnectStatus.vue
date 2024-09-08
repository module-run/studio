<script setup lang="ts">
import {EnumDeviceConnectStatus} from "../types/Device";

interface Props {
    status: EnumDeviceConnectStatus | null
}

const props = defineProps<Props>()
</script>

<template>
    <div class="inline-block text-gray-400">
        <div v-if="props.status===EnumDeviceConnectStatus.WaitConnect">
            <div class="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
            等待连接
        </div>
        <div v-else-if="props.status===EnumDeviceConnectStatus.Connecting">
            <div class="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            连接中
        </div>
        <div v-else-if="props.status===EnumDeviceConnectStatus.Disconnected">
            <div class="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
            已中断
        </div>
        <div v-else-if="props.status===EnumDeviceConnectStatus.ConnectSuccess">
            <div class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            已连接
        </div>
        <div v-else-if="props.status===EnumDeviceConnectStatus.ConnectFailed">
            <div class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            未连接
        </div>
    </div>
</template>


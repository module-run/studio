<script setup lang="ts">


import {Dialog} from "../lib/dialog";

const onUploadRequest = (option: any) => {
    const {onProgress, onError, onSuccess, fileItem, name} = option
    Dialog.tipError('开发中')
};

</script>

<template>
    <div v-if="0" class="mb-3">
        <a-button type="outline">
            <div class="">
                导入本地扩展
            </div>
        </a-button>
    </div>
    <div style="height:50vh;" class="overflow-y-auto">
        <div>
            <a-upload text="asdf" draggable :custom-request="onUploadRequest">
                <template #upload-button>
                    <div style="
        background-color: var(--color-fill-2);
        color: var(--color-text-1);
        border: 1px dashed var(--color-fill-4);
        width: 100%;
        border-radius: 0.5rem;" class="py-20 text-center rounded-lg">
                        <div>
                            <icon-plus style="font-size:1rem;"/>
                        </div>
                        <div class="text-gray-400 text-sm">
                            选择 ZIP 扩展压缩文件 或 扩展文件夹
                        </div>
                    </div>
                </template>
            </a-upload>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {ref} from "vue";
import {Dialog} from "../lib/dialog";

const updaterCheckLoading = ref(false)

type VersionDownloadCallback = Parameters<typeof window.$mapi.updater.downloadUpdate>[0];
const versionDownloadCallback: VersionDownloadCallback = (type, data) => {
    if ('error' === type) {
        Dialog.tipError('下载更新失败')
    } else if ('progress' === type) {
        Dialog.tipSuccess(`下载进度：${data.percent}%`)
    } else if ('downloaded' === type) {
        Dialog.confirm('下载完成，是否立即安装？').then(() => {
            window.$mapi.updater.quitAndInstall()
        })
    }
}
type CheckForUpdateCallback = Parameters<typeof window.$mapi.updater.checkForUpdate>[0];
const versionCheckCallback: CheckForUpdateCallback = (type, data) => {
    if ('checking' !== type) {
        updaterCheckLoading.value = false
    }
    if ('error' === type) {
        console.log('Setting.')
        Dialog.tipError('检测更新失败')
    } else if ('available' === type) {
        Dialog.confirm(`发现新版本${data.version}，是否立即下载更新？`).then(() => {
            window.$mapi.updater.downloadUpdate(versionDownloadCallback)
        })
    } else if ('notAvailable' === type) {
        Dialog.tipSuccess('已经是最新版本')
    }
}

const doVersionCheck = () => {
    updaterCheckLoading.value = true
    window.$mapi.updater.checkForUpdate(versionCheckCallback)
}
</script>

<template>
    <a-button :loading="updaterCheckLoading"
              @click="doVersionCheck()">
        检测更新
    </a-button>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {computed} from 'vue'
import {useRouter} from 'vue-router'

const route = useRouter()

const activeTab = computed(() => {
    switch (route.currentRoute.value.path) {
        case '/home':
            return 'home'
        case '/project':
        case '/project_editor':
            return 'project'
        case '/device':
            return 'device'
        case '/setting':
            return 'setting'
    }
})
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="p-4">
            <img src="/logo-white.svg"/>
        </div>
        <div class="flex-grow mt-4">
            <a class="block text-center py-3 text-gray-100"
               :class="activeTab==='home'?'text-white bg-primary':''"
               @click="$router.push('/home')"
               href="javascript:;">
                <div>
                    <icon-home class="text-xl"/>
                </div>
                <div class="text-sm">{{ $t('home') }}</div>
            </a>
            <a class="block text-center py-3 text-gray-100"
               :class="activeTab==='project'?'text-white bg-primary':''"
               @click="$router.push('/project')"
               href="javascript:;">
                <div>
                    <icon-apps class="text-xl"/>
                </div>
                <div class="text-sm">{{ $t('project') }}</div>
            </a>
            <a class="block text-center py-3 text-gray-100"
               :class="activeTab==='device'?'text-white bg-primary':''"
               @click="$router.push('/device')"
               href="javascript:;">
                <div>
                    <icon-folder class="text-xl"/>
                </div>
                <div class="text-sm">{{ $t('device') }}</div>
            </a>
        </div>
        <div>
            <a class="block text-center py-3 text-gray-100"
               :class="activeTab==='setting'?'text-white bg-primary':''"
               @click="$router.push('/setting')"
               href="javascript:;">
                <div>
                    <icon-settings class="text-xl"/>
                </div>
                <div class="text-sm">{{ $t('setting') }}</div>
            </a>
        </div>
        <div v-if="0" class="text-center">
            <a class=""
               @click="$router.push('/login')"
               href="javascript:;">
                Login
            </a>
            <a class=""
               @click="$router.push('/account')"
               href="javascript:;">
                Account
            </a>
        </div>
    </div>
</template>

<style scoped>

</style>

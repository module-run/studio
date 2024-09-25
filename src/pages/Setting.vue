<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {AppConfig} from "../config";
import {Dialog} from "../lib/dialog";
import {changeLocale, getLocale, listLocales} from '../lang'
import SettingUpdaterButton from "../components/SettingUpdaterButton.vue";

const basic = ref({
    locale: getLocale(),
    // projectRoot: 'D:/project',
})
const doUploadLog = () => {
    Dialog.confirm(
        '使用中若发生异常，如客户端闪退、卡死、任务创建或运行出错等问题，请上传日志帮助我们更好的定位和解决问题。',
        '上传日志'
    ).then(() => {
        Dialog.tipSuccess('日志上传成功')
    }).catch(() => {
        Dialog.tipError('取消上传')
    })
}

const contentContainer = ref<HTMLElement | null>(null)
const activeSection = ref('basic')
const doScrollTo = (section: string) => {
    const target = contentContainer.value?.querySelector(`[data-section="${section}"]`)
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
        })
    }
    activeSection.value = section
}
const onScroll = () => {
    const sections = contentContainer.value?.querySelectorAll('[data-section]')
    if (!sections) {
        return;
    }
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const rect = section.getBoundingClientRect()
        if (rect.top < 100 && rect.bottom > 100) {
            activeSection.value = section.getAttribute('data-section') || ''
            break
        }
    }
}
onMounted(() => {
    contentContainer.value?.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
    contentContainer.value?.removeEventListener('scroll', onScroll)
})

const locales = ref(listLocales())
const onLocaleChange = (value: string) => {
    changeLocale(value)
    basic.value.locale = value
}
</script>

<template>
    <div class="flex">
        <div class="p-8 w-56 flex-shrink-0 border-r border-solid border-gray-100">
<!--            <div class="p-2 rounded-lg mr-2 mb-4 cursor-pointer"-->
<!--                 :class="{'bg-gray-100':activeSection==='basic'}"-->
<!--                 @click="doScrollTo('basic')"-->
<!--            >-->
<!--                <div class="text-base">-->
<!--                    <icon-settings/>-->
<!--                    基础设置-->
<!--                </div>-->
<!--            </div>-->
            <div class="p-2 rounded-lg mr-2 mb-4 cursor-pointer"
                 :class="{'bg-gray-100':activeSection==='about'}"
                 @click="doScrollTo('about')">
                <div class="text-base">
                    <icon-user/>
                    关于软件
                </div>
            </div>
        </div>
        <div class="flex-grow">
            <div ref="contentContainer"
                 class="overflow-y-auto p-8 leading-8"
                 style="height:calc(100vh - var(--window-header-height));">
                <div data-section="basic" class="scroll-mt-4">
<!--                    <div class="text-base font-bold mb-4">基础设置</div>-->
                    <div>
                        <a-form :model="basic" layout="vertical">
                            <!--                            <a-form-item field="name" label="项目路径">-->
                            <!--                                <a-input-->
                            <!--                                    v-model="basic.projectRoot"-->
                            <!--                                    readonly-->
                            <!--                                    disabled-->
                            <!--                                />-->
                            <!--                            </a-form-item>-->
<!--                            <a-form-item field="name" :label="$t('language')">-->
<!--                                <a-select :model-value="basic.locale"-->
<!--                                          @change="onLocaleChange as any">-->
<!--                                    <a-option v-for="(l,lIndex) in locales"-->
<!--                                              :key="l.name"-->
<!--                                              :value="l.name">{{ l.label }}-->
<!--                                    </a-option>-->
<!--                                </a-select>-->
<!--                            </a-form-item>-->
                        </a-form>
                    </div>
                </div>
                <div class="border-b border-solid border-gray-200 my-6"></div>
                <div data-section="about" class="scroll-mt-4">
                    <div class="text-base font-bold mb-4">关于软件</div>
                    <div class="">
                        <div class="flex mb-3">
                            <div class="w-10">版本</div>
                            <div class="flex-grow">
                                v{{ AppConfig.version }}
                            </div>
                        </div>
                        <div class="flex mb-3">
                            <div class="w-10">声明</div>
                            <div class="flex-grow">
                                本产品为开源软件，遵循 GPL-3.0 license 协议。
                            </div>
                        </div>
                        <div class="flex mb-3">
                            <div class="w-10">反馈</div>
                            <div class="flex-grow">
                                <a :href="AppConfig.website" target="_blank"
                                   class="text-link">
                                    问题反馈/需求建议
                                </a>
                                <a v-if="0" href="javascript:;"
                                   @click="doUploadLog"
                                   class="text-link">
                                    上传日志
                                </a>
                            </div>
                        </div>
                        <div class="flex mb-3">
                            <div class="w-10">官网</div>
                            <div class="flex-grow">
                                <a :href="AppConfig.website" target="_blank"
                                   class="text-link">
                                    {{ AppConfig.website }}
                                </a>
<!--                                <div class="inline-block ml-3">-->
<!--                                    <SettingUpdaterButton/>-->
<!--                                </div>-->
                            </div>
                        </div>
                        <div class="text-gray-400">
                            &copy; 2024 {{ AppConfig.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

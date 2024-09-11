import {createI18n} from "vue-i18n";

import zh from './zh';
import en from './en';

const defaultLocale = 'zh'

if (window.$mapi) {
    window.$mapi.config.get('lang', defaultLocale).then((lang: string) => {
        i18n.global.locale.value = lang as any
    })
}

export let i18n = createI18n({
    locale: defaultLocale,
    legacy: false,
    globalInjection: true,
    messages: {
        zh,
        en
    }
});

export type LocaleItem = {
    name: string,
    label: string,
    active?: boolean
}

export const listLocales = () => {
    let list: LocaleItem[] = [
        {
            name: 'zh',
            label: '简体中文',
        },
        // {
        //     name: 'en',
        //     label: 'English',
        // }
    ]
    list.forEach((item) => {
        item.active = i18n.global.locale.value === item.name
    })
    return list
}

export const getLocale = () => {
    return i18n.global.locale.value
}

export const changeLocale = (lang: string) => {
    i18n.global.locale.value = lang as any
    window.$mapi.config.set('lang', lang).then(() => {
    })
}

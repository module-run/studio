<script setup lang="ts">
import {EditorView, keymap, lineNumbers} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import {onMounted, ref, watch} from "vue";
import {quietlight} from '@uiw/codemirror-theme-quietlight';
import {dracula} from '@uiw/codemirror-theme-dracula';
import {python} from "@codemirror/lang-python";
import {useProjectStore} from "../../store/modules/project";
import {ProjectModuleDataRecord} from "../../types/Project";

const projectStore = useProjectStore()
const codeEditorDom = ref<HTMLElement>()
let editor = null as EditorView | null
const useDark = false

const setEditorContent = (code: string) => {
    if (!editor) {
        setTimeout(() => {
            setEditorContent(code)
        }, 100)
        return
    }
    const transaction = editor.state.update({
        changes: {from: 0, to: editor.state.doc.length, insert: code}
    })
    editor.dispatch(transaction)
}

watch(() => projectStore.currentModuleActiveData, (newVal) => {
    if (!newVal) {
        return
    }
    // console.log('newVal', JSON.stringify(newVal))
    setEditorContent(newVal?.codePy || '')
})

onMounted(() => {
    editor = new EditorView({
        doc: '',
        extensions: [
            useDark ? dracula : quietlight,
            python(),
            keymap.of(defaultKeymap),
            lineNumbers(),
            EditorView.updateListener.of(async (update) => {
                if (update.docChanged) {
                    const code = update.state.doc.toString()
                    const data = {
                        codePy: code,
                    } as ProjectModuleDataRecord
                    await projectStore.editModuleData(data)
                }
            }),
        ],
        parent: codeEditorDom.value,
    })
    editor.focus()
})
</script>

<template>
    <div class="absolute inset-0 w-full h-full overflow-hidden">
        <div ref="codeEditorDom"
             class="absolute inset-0 w-full h-full"></div>
    </div>
</template>


<style lang="less">
.cm-editor {
    height: 100%;
    font-size: 1.2rem;
}
</style>

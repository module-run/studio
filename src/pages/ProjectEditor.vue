<script setup lang="ts">
import {Pane, Splitpanes} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import {onBeforeUnmount, onMounted, ref} from 'vue';
import ProjectEditDialog from "../components/ProjectEditDialog.vue";
import BlocklyEditor from '../components/editor/BlocklyEditor.vue';
import {useRoute} from "vue-router";
import {UI} from "../lib/ui";
import {EnumProjectType} from "../types/Project";
import PythonEditor from "../components/editor/PythonEditor.vue";
import {useProjectStore} from "../store/modules/project";
import ProjectEditorPipManager from "../components/ProjectEditorPipManager.vue";
import ProjectEditorExtendManager from "../components/ProjectEditorExtendManager.vue";
import ProjectEditorModuleManager from "../components/ProjectEditorModuleManager.vue";
import ProjectEditorDeviceManager from "../components/ProjectEditorDeviceManager.vue";
import ProjectEditorLogManager from "../components/ProjectEditorLogManager.vue";
import {Dialog} from "../lib/dialog";
import DeviceSelector from "../components/DeviceSelector.vue";
import ProjectEditorDebugManager from "../components/ProjectEditorDebugManager.vue";
import {useDeviceStore} from "../store/modules/device";
import {useLogStore} from "../store/modules/log";
import {EncodeUtil} from "../lib/util";
import {EventType} from "../types/Event";
import {GlobalEvent} from "../lib/event";

const deviceStore = useDeviceStore()
const projectStore = useProjectStore()
const logStore = useLogStore()
const route = useRoute()
const projectId = ref<string>(route.query.id + '')
const editDialog = ref(<InstanceType<typeof ProjectEditDialog> | null>null);
const blocklyEditor = ref<InstanceType<typeof BlocklyEditor> | null>(null)
const rightInitWidth = Math.ceil(300 / window.innerWidth * 100)
const workspaceContainer = ref<HTMLElement | null>(null)
const workspaceRightSize = ref(rightInitWidth)
const workspaceRightMinSize = ref(rightInitWidth)
const workspaceBottomMinSize = ref(10)
const workspaceBottomSize = ref(40)
onMounted(async () => {
    await projectStore.open(projectId.value)
    UI.onResize(workspaceContainer?.value, (width, height) => {
        workspaceRightMinSize.value = Math.ceil(100 * 300 / width)
        workspaceRightSize.value = workspaceRightMinSize.value
        workspaceBottomMinSize.value = Math.ceil(100 * 40 / height)
        workspaceBottomSize.value = Math.ceil(100 * 40 / height)
    })
})
onBeforeUnmount(() => {
    UI.offResize(workspaceContainer?.value)
})

const footTab = ref<string>('log')
const doSwitchFootTab = (tab: string) => {
    if (footTab.value === tab) {
        console.log(workspaceBottomSize.value, workspaceBottomMinSize.value)
        if (workspaceBottomSize.value === workspaceBottomMinSize.value) {
            workspaceBottomSize.value = 50
        } else {
            workspaceBottomSize.value = workspaceBottomMinSize.value
        }
    } else {
        footTab.value = tab
        workspaceBottomSize.value = 50
    }
}
const autoExtendLogPanel = () => {
    if (footTab.value === 'log') {
        if (workspaceBottomSize.value === workspaceBottomMinSize.value) {
            workspaceBottomSize.value = 50
        }
    }
}
onMounted(() => {
    GlobalEvent.on(EventType.NewLog, autoExtendLogPanel)
})
onBeforeUnmount(() => {
    GlobalEvent.off(EventType.NewLog, autoExtendLogPanel)
})

const rightTab = ref<string>('module')
const onRightTabChange = (key: string | number) => {
    rightTab.value = key as string
}

const doRun = async () => {
    const device = deviceStore.getById(projectStore.current?.defaultDevice as string)
    if (!device) {
        Dialog.tipError('设备不存在')
        return
    }
    logStore.pLogInfo(`开始连接设备 - ${device.title}`)
    try {
        deviceStore.connect(device, false)
        await deviceStore.connectReady(device)
        logStore.pLogInfo('连接设备成功')
        await device.connect?.send('project.create', {
            id: projectStore.current?.id
        }, true, [0, -6])
        logStore.pLogInfo('开始同步文件')
        const files = await window.MAPI.fileListAll(`project/${projectStore.current?.id}`)
        for (let f of files) {
            logStore.pLogInfo(`同步文件 - ${f.path}`)
            const content = await window.MAPI.fileRead(`project/${projectStore.current?.id}/${f.path}`)
            await device.connect?.send('project.fileWrite', {
                id: projectStore.current?.id,
                files: [
                    {
                        path: f.path,
                        content: EncodeUtil.base64Encode(content)
                    }
                ]
            }, true)
        }
        logStore.pLogInfo('同步文件完成')
        logStore.pLogInfo('开始安装pip依赖')
        const pipPackages = {}
        for (let p of projectStore.current?.pipDependencies || []) {
            pipPackages[p.name] = p.version
        }
        await device.connect?.send('project.pipInstall', {
            id: projectStore.current?.id,
            packages: pipPackages
        }, true)
        logStore.pLogInfo('pip依赖安装完成')
        logStore.pLogInfo('开始运行项目')
        await device.connect?.send('project.run', {
            id: projectStore.current?.id
        }, true)
        logStore.pLogInfo('项目运行成功')
    } catch (e) {
        let msg = (e as any).toString()
        logStore.pLogError(`运行错误：${msg}`)
    }
}

const onModuleChange = async (key: string | number) => {
    await projectStore.activeModule(key as string)
};
const doModuleAdd = async () => {
    await projectStore.addModule()
};
const doModuleDelete = (key: string | number) => {
    if (projectStore.currentModules.length <= 1) {
        Dialog.tipError('至少保留一个模块')
        return
    }
    Dialog.confirm('确定删除该模块吗？')
        .then(() => {
            projectStore.deleteModule(key as string)
        })
};

</script>

<template>
    <div class="p-3 flex items-center h-14 border-b border-solid border-gray-200">
        <div class="mr-2">
            <a-button @click="$router.back()">
                <icon-left class="mr-1"/>
                项目列表
            </a-button>
        </div>
        <div class="text-xl font-bold">
            {{ projectStore.current?.title }}
            <a class="ml-1 text-gray-400" href="javascript:;"
               @click="editDialog?.show(projectId)">
                <icon-pen/>
            </a>
            <a-popover>
                <span class="inline-block ml-4 text-gray-300 cursor-pointer">
                    <icon-info-circle/>
                </span>
                <template #content>
                    <div class="leading-10">
                        <div>标识：<span class="font-mono">{{ projectStore.current?.id }}</span></div>
                        <div v-if="projectStore.current?.type===EnumProjectType.Blockly">
                            <a-button size="mini" @click="blocklyEditor?.showCode()">
                                <icon-code></icon-code>
                                模块代码
                            </a-button>
                        </div>
                    </div>
                </template>
            </a-popover>
        </div>
        <div class="flex-grow text-right">
            <div class="inline-block mr-2 align-top">
                <DeviceSelector/>
            </div>
            <a-button class="ml-1" type="primary" status="success"
                      @click="doRun()">
                <icon-play-arrow/>
            </a-button>
        </div>
    </div>
    <div ref="workspaceContainer"
         class="project-panel absolute bottom-0 right-0"
         style="top:calc(var(--window-header-height) + 3.5rem);left:var(--page-nav-width);">
        <splitpanes v-if="workspaceRightMinSize>0"
                    class="default-theme">
            <pane :min-size="40">
                <splitpanes horizontal>
                    <pane :size="100-workspaceBottomSize">
                        <div class="h-full flex flex-col">
                            <div class="flex project-module">
                                <a-tabs :editable="true"
                                        default-active-key="1"
                                        :active-key="projectStore.currentModuleActive"
                                        @change="onModuleChange"
                                        @add="doModuleAdd"
                                        @delete="doModuleDelete"
                                        show-add-button auto-switch>
                                    <a-tab-pane v-for="(item, index) of projectStore.currentModules"
                                                :key="item.name"
                                                :title="item.title"
                                                :closable="projectStore.currentModules.length>1"></a-tab-pane>
                                </a-tabs>
                            </div>
                            <div class="flex-grow relative">
                                <BlocklyEditor v-if="projectStore.current?.type===EnumProjectType.Blockly"
                                               ref="blocklyEditor"/>
                                <PythonEditor v-if="projectStore.current?.type===EnumProjectType.Python"/>
                            </div>
                        </div>
                    </pane>
                    <pane :min-size="workspaceBottomMinSize"
                          :size="workspaceBottomSize">
                        <div class="bg-white h-full relative">
                            <a-tabs default-active-key="log" class="select-none">
                                <a-tab-pane key="log">
                                    <template #title>
                                        <div @click="doSwitchFootTab('log')">
                                            <icon-file/>
                                            日志
                                        </div>
                                    </template>
                                </a-tab-pane>
                                <a-tab-pane key="debug">
                                    <template #title>
                                        <div @click="doSwitchFootTab('debug')">
                                            <icon-play-arrow/>
                                            调试
                                        </div>
                                    </template>
                                </a-tab-pane>
                            </a-tabs>
                            <div v-if="footTab==='log'"
                                 class="absolute bottom-0 right-1 left-0 top-12">
                                <ProjectEditorLogManager/>
                            </div>
                            <div v-else-if="footTab==='debug'"
                                 class="absolute bottom-0 right-1 left-0 top-12 overflow-y-auto">
                                <ProjectEditorDebugManager/>
                            </div>
                        </div>
                    </pane>
                </splitpanes>
            </pane>
            <pane :min-size="workspaceRightMinSize"
                  :size="workspaceRightSize">
                <div class="bg-white h-full relative">
                    <a-tabs default-active-key="module" @change="onRightTabChange">
                        <a-tab-pane key="module" title="模块"></a-tab-pane>
                        <a-tab-pane key="extend" title="扩展"></a-tab-pane>
                        <a-tab-pane key="pip" title="pip依赖"></a-tab-pane>
                        <a-tab-pane key="device" title="设备"></a-tab-pane>
                    </a-tabs>
                    <div class="absolute top-12 right-0 left-0 bottom-0 overflow-y-auto py-2">
                        <div v-if="rightTab==='module'">
                            <ProjectEditorModuleManager/>
                        </div>
                        <div v-if="rightTab==='extend'">
                            <ProjectEditorExtendManager/>
                        </div>
                        <div v-if="rightTab==='pip'">
                            <ProjectEditorPipManager/>
                        </div>
                        <div v-if="rightTab==='device'">
                            <ProjectEditorDeviceManager/>
                        </div>
                    </div>
                </div>
            </pane>
        </splitpanes>
    </div>
    <ProjectEditDialog ref="editDialog"/>
</template>

<style lang="less" scoped>
.project-module {
    height: 3rem;
    overflow-y: hidden;

    :deep(.arco-tabs-tab) {
        padding: 0.5rem 1rem;
        margin: 0.25rem 0 0 0;
        border-bottom: none;
    }

    :deep(.arco-tabs-nav-ink) {
        display: none !important;
    }

    :deep(.arco-tabs-tab-active) {
        background-color: #FFFFFF;
        border-radius: 0.5rem 0.5rem 0 0;
        color: #000000;
        border-bottom: none;
        font-weight: bold;
    }
}

.project-panel {
    :deep(.splitpanes--vertical), :deep(.splitpanes__pane) {
        transition: none !important;
    }
}
</style>

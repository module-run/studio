<script setup lang="ts">
import {ref} from "vue";
import {Dialog} from "../lib/dialog";
import { useDeviceStore} from "../store/modules/device";
import {EnumDeviceConnectType, EnumDeviceType} from "../types/Device";
import {Connect} from "../lib/connect";

const deviceStore = useDeviceStore()

const editIndex = ref(-1)

const visible = ref(false)
const editData = ref<DeviceRecord>({
    type: null,
    connectType: null,
    title: '',
    addr: '',
    port: '',
} as DeviceRecord)

const add = () => {
    editData.value.type = EnumDeviceType.RaspberryPi
    editData.value.connectType = EnumDeviceConnectType.NETWORK
    editData.value.addr = ''
    editData.value.port = ''
    editData.value.title = ''
    editIndex.value = -1
    visible.value = true
}

const edit = (index: number) => {
    const record = deviceStore.records[index]
    editData.value.type = record.type
    editData.value.connectType = record.connectType
    editData.value.addr = record.addr
    editData.value.port = record.port
    editData.value.title = record.title
    editIndex.value = index
    visible.value = true
}

const doSubmit = () => {
    if (!editData.value.addr) {
        Dialog.tipError('请输入IP')
        return
    }
    if (!editData.value.port) {
        editData.value.port = '62408'
    }
    if (!editData.value.title) {
        editData.value.title = '设备' + editData.value.addr
    }
    if (editIndex.value >= 0) {
        deviceStore.edit(editIndex.value, editData.value)
    } else {
        deviceStore.add(editData.value)
    }
    visible.value = false
    Dialog.tipSuccess('创建成功')
}

const testConnectLoading = ref(false)
const testButtonText = ref('测试连接')
const doTestConnect = () => {
    testConnectLoading.value = true
    testButtonText.value = '正在连接...'
    if (!editData.value.addr) {
        Dialog.tipError('请输入IP')
        return
    }
    const device = {
        type: editData.value.type,
        connectType: editData.value.connectType,
        addr: editData.value.addr,
        port: editData.value.port || '62408',
    } as DeviceRecord
    const connect = new Connect(device)
    connect.testConnect()
        .then((msg) => {
            Dialog.tipSuccess('连接成功')
        })
        .catch((msg) => {
            Dialog.tipError('连接失败:' + msg)
        })
        .finally(() => {
            testButtonText.value = '测试连接'
            testConnectLoading.value = false
        })
}
defineExpose({
    add, edit
})
</script>

<template>
    <a-modal v-model:visible="visible"
             width="50rem"
             title-align="start">
        <template #title>
            添加设备
        </template>
        <template #footer>
            <a-button @click="doTestConnect"
                      :loading="testConnectLoading">
                {{ testButtonText }}
            </a-button>
            <a-button type="primary"
                      @click="doSubmit">
                保存
            </a-button>
        </template>
        <div>
            <div class="px-2 pt-6">
                <a-form :model="editData">
                    <a-form-item label="类型" required>
                        <a-space size="large">
                            <a-radio :value="EnumDeviceType.RaspberryPi"
                                     v-model="editData.type">
                                树莓派
                            </a-radio>
                        </a-space>
                    </a-form-item>
                    <a-form-item label="IP" required>
                        <a-input v-model="editData.addr"
                                 placeholder="输入IP x.x.x.x"/>
                    </a-form-item>
                    <a-form-item label="端口">
                        <a-input v-model="editData.port"
                                 placeholder="默认为 62408"/>
                    </a-form-item>
                    <a-form-item label="设备名称">
                        <a-input v-model="editData.title"
                                 placeholder="默认自动生成"/>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </a-modal>
</template>


import {WorkspaceSvg} from "blockly/core/workspace_svg";
import * as Blockly from "blockly/core";
import {Workspace} from "blockly/core";
import * as ZhHans from "blockly/msg/zh-hans";
import type {BlocklyOptions} from "blockly/core/blockly_options";
import {ContinuousFlyout, ContinuousMetrics, ContinuousToolbox} from '@blockly/continuous-toolbox';
import {clone, debounce} from "lodash-es";
import {BlocklyToolboxRecord} from "../../../types/Blockly";
import {DefaultBlocklyToolboxes} from "./blocks";
import {Order, pythonGenerator} from "blockly/python";
import {useProjectStore} from "../../../store/modules/project";
import {ProjectExtendRecord, ProjectExtendRecordFunction} from "../../../types/Project";

import "./dialogs"
import "./theme"
import {CustomCategory} from "./custom";

const projectStore = useProjectStore()

export class BlocklyManager {

    isInit: boolean = false
    container: Element | null = null
    workspace: WorkspaceSvg | null = null
    listeners: { [key: string]: Function[] } = {}

    constructor() {
    }

    init(container: Element | null) {
        Blockly.setLocale(ZhHans);

        let options = {
            theme: 'mTheme',
            media: './node_modules/blockly/media/',
            comments: true,
            collapse: true,
            disable: true,
            grid: {
                spacing: 25,
                length: 3,
                colour: '#CCCCCC',
                snap: true,
            },
            horizontalLayout: false,
            maxBlocks: Infinity,
            // plugins: {
            // toolbox: ContinuousToolbox,
            // flyoutsVerticalToolbox: ContinuousFlyout,
            //     metricsManager: ContinuousMetrics,
            // },
            // maxTrashcanContents: 256,
            oneBasedIndex: true,
            readOnly: false,
            toolbox: {
                kind: "categoryToolbox",
                contents: []
            },
            toolboxPosition: 'start',
            renderer: 'geras',
            move: {
                scrollbars: true,
                drag: true,
                wheel: false,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 4,
                minScale: 0.25,
                scaleSpeed: 1.1,
            },
        } as BlocklyOptions;

        Blockly.registry.register(
            Blockly.registry.Type.TOOLBOX_ITEM,
            Blockly.ToolboxCategory.registrationName,
            CustomCategory,
            true,
        );

        this.container = container;
        this.workspace = Blockly.inject(this.container as Element, options);

        const changeListener = debounce(() => {
            this.fire('change', this)
        }, 300)

        this.workspace.addChangeListener((event) => {
            if (!this.isInit) {
                return
            }
            changeListener()
        })

        pythonGenerator.init(this.workspace)

        setTimeout(() => {
            this.isInit = true
        }, 100)
    }

    destroy() {
        this.workspace?.dispose();
        this.workspace = null
    }

    on(event: string, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback)
    }

    off(event: string, callback: Function) {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }

    fire(event: string, ...args: any[]) {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach(cb => cb(...args))
    }

    resize() {
        Blockly.svgResize(this.workspace as WorkspaceSvg);
    }

    setValue(state: Object) {
        this.workspace?.clear();
        Blockly.serialization.workspaces.load(state, this.workspace as Workspace);
    }

    getValue() {
        return Blockly.serialization.workspaces.save(this.workspace as Workspace);
    }

    getCode() {
        return pythonGenerator.workspaceToCode(this.workspace as Workspace);
    }

    getCodeBlocks() {
        let res: any[] = [];
        let arrBlocks = this.workspace?.getTopBlocks(true);
        if (!arrBlocks) {
            return res;
        }
        //TODO 已经初始化过了，但是这里还是报错，先这样处理
        // pythonGenerator.init(this.workspace as Workspace)
        arrBlocks.forEach(block => {
            res.push({
                type: block.type,
                block: block,
                code: pythonGenerator.blockToCode(block)
            })
        })
        return res;
    }

    getCodeBlocksPy() {
        const codeBlocks = this.getCodeBlocks()

        let code: string[] = []

        let codeBlockIndex = 0

        code.push('import module_run');
        projectStore.currentExtends.forEach(e => {
            code.push(`import extend.${e.name}.main`)
        })
        code.push('')
        code.push('')

        for (const codeBlock of codeBlocks) {
            // 如果是一个独立的赋值语句，格式为 ['aa', 0]
            if (Array.isArray(codeBlock.code)) {
                continue
            }
            if (!codeBlock.code) {
                continue
            }
            codeBlockIndex++
            code.push(`# block ${codeBlockIndex}`)
            code.push(`def block_${codeBlockIndex}():`)
            let codeLines: string[] = codeBlock.code.split('\n')
            codeLines.forEach(line => {
                code.push(`  ${line}`)
            })
            code.push('')
            code.push('')
        }
        // console.log('getCodeBlocksPy', projectStore.current?.id, code.join('\n'))
        return code.join('\n')
    }

    update() {
        this.setValue(clone(this.getValue()))
    }

    updateToolbox(toolboxes: BlocklyToolboxRecord[]) {
        let mergedToolbox: any = clone(DefaultBlocklyToolboxes)
        mergedToolbox = this.mergeProjectExtends(mergedToolbox)
        this.workspace?.updateToolbox({
            kind: "categoryToolbox",
            contents: mergedToolbox
        });
        this.workspace?.getToolbox()?.refreshSelection();
    }

    mergeProjectExtends(mergedToolbox: Array<any>) {

        const extendCategoryIndex = mergedToolbox.findIndex(e => e.categoryStyle === 'extend_category')

        mergedToolbox[extendCategoryIndex].contents = []

        // remove all extend start with "extend."
        Object.keys(Blockly.Blocks).forEach(key => {
            if (key.startsWith('extend.')) {
                delete Blockly.Blocks[key]
            }
        })

        for (const e of projectStore.currentExtends) {
            if (!e.function || !e.function.length) {
                continue
            }
            for (const f of e.function) {
                const blockDefinition = this.convertFunctionToBlockDefinition(e, f)
                if (blockDefinition['type'] in Blockly.Blocks) {
                    delete Blockly.Blocks[blockDefinition['type']]
                }
                Blockly.defineBlocksWithJsonArray([blockDefinition])
                pythonGenerator.forBlock[blockDefinition['type']] = ((eLocal, fLocal, bdLocal) => {
                    const functionEntry = this.convertTypeToFunctionEntry(eLocal, fLocal)
                    return function (block, generator) {
                        let code: string[] = []
                        code.push(functionEntry)
                        code.push('(')
                        fLocal.params.forEach((p, pIndex) => {
                            if (pIndex > 0) {
                                code.push(', ')
                            }
                            let value
                            p.inputType = p.inputType || 'text'
                            switch (p.inputType) {
                                case 'number':
                                case 'angle':
                                case 'text':
                                    value = generator.valueToCode(block, p.name, Order.ATOMIC)
                                    break
                                case 'checkbox':
                                    value = block.getFieldValue(p.name) === 'TRUE' ? 'True' : 'False'
                                    break
                                case 'select':
                                    value = generator.quote_(block.getFieldValue(p.name))
                                    break
                            }
                            code.push(value)
                        })
                        code.push(')')
                        code.push("\n")
                        return code.join('')
                    }
                })(e, f, blockDefinition);
                const blockContent = this.convertFunctionToBlockContent(e, f)
                mergedToolbox[extendCategoryIndex].contents.push(blockContent)
            }
        }

        return mergedToolbox
    }

    convertTypeToFunctionEntry(e: ProjectExtendRecord, f: ProjectExtendRecordFunction) {
        return `extend.${e.name}.main.${f.name}`
    }

    convertFunctionToBlockContent(e: ProjectExtendRecord, f: ProjectExtendRecordFunction) {
        const blockContent = {}
        blockContent['kind'] = 'block'
        blockContent['type'] = `extend.${e.name}.${f.name}`
        blockContent['inputs'] = {}
        f.params.forEach(p => {
            p.inputType = p.inputType || 'text'
            switch (p.inputType) {
                case 'text':
                case 'number':
                case 'angle':
                    blockContent['inputs'][p.name] = {
                        block: {
                            "type": "text",
                            "fields": {
                                "VALUE": p.defaultValue
                            }
                        }
                    }
                    break
            }
        })
        return blockContent
    }

    convertFunctionToBlockDefinition(e: ProjectExtendRecord, f: ProjectExtendRecordFunction) {
        const blockDefinition = {}
        blockDefinition['type'] = `extend.${e.name}.${f.name}`
        blockDefinition['tooltip'] = e.title

        const message0: string[] = []
        const args0: any[] = []
        message0.push(f.title)
        let paramIndex = 1
        f.params.forEach(p => {
            if (f.paramMultiline) {
                message0.push('\n')
            }
            if (p.inputLayoutTemplate) {
                message0.push(p.inputLayoutTemplate.replace('{input}', `%${paramIndex}`))
            } else {
                message0.push(`${p.title} %${paramIndex}`)
            }
            paramIndex++
            let arg = {}
            arg['name'] = p.name
            p.inputType = p.inputType || 'text'
            switch (p.inputType) {
                case 'number':
                case 'angle':
                    arg['type'] = 'input_value'
                    arg['check'] = 'String'
                    break
                case 'checkbox':
                    arg['type'] = 'field_checkbox'
                    arg['checked'] = 'TRUE'
                    arg['check'] = 'String'
                    break
                case 'select':
                    arg['type'] = 'field_dropdown'
                    arg['options'] = p.options.map(o => [o.label, o.value])
                    arg['check'] = 'String'
                    break
                case 'text':
                    arg['type'] = 'input_value'
                    arg['check'] = 'String'
                    break
            }
            args0.push(arg)
        })

        blockDefinition['message0'] = message0.join('')
        blockDefinition['args0'] = args0
        blockDefinition['previousStatement'] = null
        blockDefinition['nextStatement'] = null
        blockDefinition['colour'] = 0
        blockDefinition['inputsInline'] = true
        blockDefinition['style'] = 'extend_blocks'

        // console.log('blockDefinition', JSON.stringify(blockDefinition, null, 2))

        return blockDefinition
    }

}

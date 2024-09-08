import * as Blockly from 'blockly';
import {Order, pythonGenerator} from "blockly/python";
import {BlocklyColors} from "./theme";

export const DefaultBlocklyToolboxes = [
    {
        kind: 'category',
        name: '变量',
        categoryStyle: 'variable_category',
        custom: 'VARIABLE'
    },
    {
        kind: 'category',
        name: '基础',
        categoryStyle: 'basic_category',
        contents: [
            {
                kind: 'block',
                type: 'text',
            },
            {
                "kind": "block",
                "type": "controls_if"
            },
            {
                "kind": "block",
                "type": "controls_ifelse"
            },
            {
                "kind": "block",
                "type": "logic_boolean"
            },

            {
                "kind": "block",
                "type": "logic_compare"
            },
            {
                "kind": "block",
                "type": "logic_operation"
            },
            {
                "kind": "block",
                "type": "logic_negate"
            },
            {
                kind: 'block',
                type: 'controls_repeat_ext',
                inputs: {
                    TIMES: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 10,
                            },
                        },
                    },
                },
            },
            {
                kind: 'block',
                type: 'controls_whileUntil',
            },
            {
                kind: 'block',
                type: 'controls_for',
                fields: {
                    VAR: 'i',
                },
                inputs: {
                    FROM: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 1,
                            },
                        },
                    },
                    TO: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 10,
                            },
                        },
                    },
                    BY: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 1,
                            },
                        },
                    },
                },
            },
            {
                kind: 'block',
                type: 'controls_forEach',
            },
            {
                kind: 'block',
                type: 'controls_flow_statements',
            },
        ],
    },
    {
        kind: 'category',
        name: '数学',
        categoryStyle: 'math_category',
        contents: [
            {
                kind: 'block',
                type: 'math_arithmetic',
            },
            {
                kind: 'block',
                type: 'math_single',
            },
            {
                kind: 'block',
                type: 'math_trig',
            },
            {
                kind: 'block',
                type: 'math_constant',
            },
            {
                kind: 'block',
                type: 'math_number_property',
            },
            {
                kind: 'block',
                type: 'math_round',
            },
            {
                kind: 'block',
                type: 'math_on_list',
            },
            {
                kind: 'block',
                type: 'math_modulo',
            },
            {
                kind: 'block',
                type: 'math_constrain',
                inputs: {
                    LOW: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 1,
                            },
                        },
                    },
                    HIGH: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 100,
                            },
                        },
                    },
                },
            },
            {
                kind: 'block',
                type: 'math_random_int',
                inputs: {
                    FROM: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 1,
                            },
                        },
                    },
                    TO: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 100,
                            },
                        },
                    },
                },
            },
            {
                kind: 'block',
                type: 'math_random_float',
            },
            {
                kind: 'block',
                type: 'math_atan2',
            },
            // {
            //     "kind": "block",
            //     "type": "math_change"
            // },
        ],
    },
    {
        kind: 'category',
        name: '文本',
        categoryStyle: 'text_category',
        contents: [
            {
                "kind": "block",
                "type": "text_join"
            },
            {
                "kind": "block",
                "type": "text_append"
            },
            {
                "kind": "block",
                "type": "text_length"
            },
            {
                "kind": "block",
                "type": "text_isEmpty"
            },
            {
                "kind": "block",
                "type": "text_indexOf"
            },
            {
                "kind": "block",
                "type": "text_charAt"
            },
            {
                "kind": "block",
                "type": "text_getSubstring"
            },
            {
                "kind": "block",
                "type": "text_changeCase"
            },
            {
                "kind": "block",
                "type": "text_trim"
            },
            {
                "kind": "block",
                "type": "text_count"
            },
            {
                "kind": "block",
                "type": "text_replace"
            },
            {
                "kind": "block",
                "type": "text_reverse"
            },
        ]
    },
    {
        kind: 'category',
        name: '列表',
        categoryStyle: 'list_category',
        contents: [
            {
                kind: 'block',
                type: 'lists_create_empty',
            },
            {
                kind: 'block',
                type: 'lists_create_with',
                extraState: {
                    itemCount: 2,
                },
            },
            {
                kind: 'block',
                type: 'lists_repeat',
                inputs: {
                    NUM: {
                        block: {
                            type: 'text',
                            fields: {
                                NUM: 5,
                            },
                        },
                    },
                },
            },
            {
                kind: 'block',
                type: 'lists_length',
            },
            {
                kind: 'block',
                type: 'lists_isEmpty',
            },
            {
                kind: 'block',
                type: 'lists_indexOf',
            },
            {
                kind: 'block',
                type: 'lists_getIndex',
            },
            {
                kind: 'block',
                type: 'lists_setIndex',
            },
            {
                "kind": "block",
                "type": "lists_reverse"
            },
            {
                "kind": "block",
                "type": "lists_getSublist"
            },
            {
                "kind": "block",
                "type": "lists_sort"
            },
            {
                "kind": "block",
                "type": "lists_split"
            }
        ],
    },
    {
        kind: 'category',
        name: '扩展',
        categoryStyle: 'extend_category',
        contents: []
    },
    // {
    //     kind: 'category',
    //     name: '其他',
    //     categoryStyle: 'other_category',
    //     contents: [
    //         {
    //             "kind": "block",
    //             "type": "text_create_join_container"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "text_create_join_item"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "text_print"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "text_prompt_ext"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "text_prompt"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "procedures_defnoreturn"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "procedures_defreturn"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "procedures_mutatorcontainer"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "procedures_mutatorarg"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "procedures_callnoreturn"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "procedures_callreturn"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "procedures_ifreturn"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "math_number"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "logic_null"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "logic_ternary"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "controls_if_if"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "controls_if_elseif"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "controls_if_else"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "lists_create_with_container"
    //         },
    //         {
    //             "kind": "block",
    //             "type": "lists_create_with_item"
    //         },
    //     ]
    // },
    // {
    //     kind: 'category',
    //     name: '方法',
    //     categoryStyle: 'procedure_category',
    //     custom: 'PROCEDURE',
    // },
]

// let blocks = []
// Object.keys(Blockly.Blocks).forEach(key => {
//     blocks.push({
//         kind: 'block',
//         type: key,
//     })
// })
// console.log('blocks', JSON.stringify(blocks, null, 2))

// Blockly.defineBlocksWithJsonArray([
//     {
//         "type": "input_text_block",
//         "message0": "字符串%1",
//         "args0": [
//             {
//                 "type": "field_input",
//                 "name": "VALUE",
//                 "text": ""
//             }
//         ],
//         "output": "String",
//         "colour": BlocklyColors.StringColor,
//         "tooltip": "变量输入块",
//     },
// ])
//
// let results: any[] = []
// pythonGenerator.forBlock['input_text_block'] = function (block, generator) {
//     return [generator.quote_(block.getFieldValue('VALUE')), Order.ATOMIC];
// }


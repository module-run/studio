<script setup lang="ts">
import {onMounted, ref, shallowRef} from 'vue';
import BlocklyEditor from '../components/editor/BlocklyEditor.vue';
import { EnumCodeType } from '../types/EnumCodeType';

let tb01 = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "运动",
      "key":"control",
      "colour":1,
      "contents": [
        {
          "kind": "block",
          "type": "mb_car_move"
        },
        {
          "kind": "block",
          "type": "mb_car_turn"
        },
        {
          "kind": "block",
          "type": "mb_arm_turn"
        },
        {
          "kind": "block",
          "type": "mb_claw_turn"
        },
        
        {
          "kind": "block",
          "type": "mb_wait"
        },
        {
          "kind": "block",
          "type": "mb_exit"
        },
        {
          "kind": "block",
          "type": "mb_msg"
        },
        {
          "kind": "block",
          "type": "mb_recv"
        },
      ]
    },
    {
            kind: 'category',
            name: '逻辑',
            categorystyle: 'logic_category',
            contents: [
              {
                    kind: 'block',
                    type: 'controls_if',
                  },
                  {
                    kind: 'block',
                    type: 'controls_if',
                    extraState: {
                      hasElse: 'true',
                    },
                  },
                  {
                    kind: 'block',
                    type: 'controls_if',
                    extraState: {
                      hasElse: 'true',
                      elseIfCount: 1,
                  },
              },
              {
                    kind: 'block',
                    type: 'logic_compare',
                  },
                  {
                    kind: 'block',
                    type: 'logic_operation',
                  },
                  {
                    kind: 'block',
                    type: 'logic_negate',
                  },
                  {
                    kind: 'block',
                    type: 'logic_boolean',
                  },
                  {
                    kind: 'block',
                    type: 'logic_null',
                  },
                  {
                    kind: 'block',
                    type: 'logic_ternary',
                  },
            ],
          },
          {
            kind: 'category',
            name: '循环',
            categorystyle: 'loop_category',
            contents: [
              {
                kind: 'block',
                type: 'controls_repeat_ext',
                inputs: {
                  TIMES: {
                    block: {
                      type: 'math_number',
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
                      type: 'math_number',
                      fields: {
                        NUM: 1,
                      },
                    },
                  },
                  TO: {
                    block: {
                      type: 'math_number',
                      fields: {
                        NUM: 10,
                      },
                    },
                  },
                  BY: {
                    block: {
                      type: 'math_number',
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
            categorystyle: 'math_category',
            contents: [
              {
                kind: 'block',
                type: 'math_number',
                fields: {
                  NUM: 123,
                },
              },
              {
                kind: 'block',
                type: 'math_arithmetic',
                fields: {
                  OP: 'ADD',
                },
              },
              {
                kind: 'block',
                type: 'math_single',
                fields: {
                  OP: 'ROOT',
                },
              },
              {
                kind: 'block',
                type: 'math_trig',
                fields: {
                  OP: 'SIN',
                },
              },
              {
                kind: 'block',
                type: 'math_constant',
                fields: {
                  CONSTANT: 'PI',
                },
              },
              {
                kind: 'block',
                type: 'math_number_property',
                extraState: '<mutation divisor_input="false"></mutation>',
                fields: {
                  PROPERTY: 'EVEN',
                },
              },
              {
                kind: 'block',
                type: 'math_round',
                fields: {
                  OP: 'ROUND',
                },
              },
              {
                kind: 'block',
                type: 'math_on_list',
                extraState: '<mutation op="SUM"></mutation>',
                fields: {
                  OP: 'SUM',
                },
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
                      type: 'math_number',
                      fields: {
                        NUM: 1,
                      },
                    },
                  },
                  HIGH: {
                    block: {
                      type: 'math_number',
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
                      type: 'math_number',
                      fields: {
                        NUM: 1,
                      },
                    },
                  },
                  TO: {
                    block: {
                      type: 'math_number',
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
            ],
          },
          {
            kind: 'category',
            name: '列表',
            categorystyle: 'list_category',
            contents: [
              {
                kind: 'block',
                type: 'lists_create_empty',
              },
              {
                kind: 'block',
                type: 'lists_create_with',
                extraState: {
                  itemCount: 3,
                },
              },
              {
                kind: 'block',
                type: 'lists_repeat',
                inputs: {
                  NUM: {
                    block: {
                      type: 'math_number',
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
                fields: {
                  END: 'FIRST',
                },
              },
              {
                kind: 'block',
                type: 'lists_getIndex',
                fields: {
                  MODE: 'GET',
                  WHERE: 'FROM_START',
                },
              },
              {
                kind: 'block',
                type: 'lists_setIndex',
                fields: {
                  MODE: 'SET',
                  WHERE: 'FROM_START',
                },
              },
            ],
          },
          {
            kind: 'sep',
          },
          {
            kind: 'category',
            name: '变量',
            categorystyle: 'variable_category',
            custom: 'VARIABLE',
          },
          {
            kind: 'category',
            name: '方法',
            categorystyle: 'procedure_category',
            custom: 'PROCEDURE',
          },
   
  ]
}


const editor = ref();

const viewCode = ()=>{
  let res = editor.value.generateCode();
  console.log('###res,',res);
  ///editor.value.updateToolbox(tb02);
}

const onChange = (e)=>{
  
}

let savedState = null;

const save = ()=>{
  let state = editor.value.save();
  console.log('###state,',state.blocks.blocks[0]);
  savedState = state;
}


const load = ()=>{
  editor.value.load(savedState);
}

const getAllBlocks = ()=>{
  let res = editor.value.getAllBlocksCode();
  console.log('###getallblcks,',res);
}


const injectCode= ()=>{
  let res = editor.value.injectCode({
    name:'mb_car_move',
    params:[
      {
        type: "field_dropdown",
        name: "direction"
      },
      {
        type: "field_number",
        name: "distance"
      },
      {
        type: "field_dropdown",
        name: "unit"
      }
    ]
  })

  console.log('resCOde,',res);
}
</script>

<template>
  <div class="wp">
    <BlocklyEditor :toolbox="tb01" ref="editor" @change="onChange"/>

    <a-button type="primary" @click="viewCode" >Primary</a-button>

    <a-button type="primary" @click="save" >保存</a-button>

    <a-button type="primary" @click="load" >回复</a-button>
    <a-button type="primary" @click="getAllBlocks" >获取所有快</a-button>
    <a-button type="primary" @click="injectCode" >注入函数</a-button>
  </div>
  
</template>
  
<style scoped>
  .wp{
    width:1000px;
    height:600px;
  }
 
</style>
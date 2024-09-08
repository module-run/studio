import * as Blockly from 'blockly';

const theme = Blockly.Theme.defineTheme('mTheme', {
    base: Blockly.Themes.Classic,
    categoryStyles: {
        'colour_category': {'colour': '#4c97ff'},
        'list_category': {'colour': '#ffab19'},
        'logic_category': {'colour': '#4c97ff'},
        'loop_category': {'colour': '#4c97ff'},
        'math_category': {'colour': '#9966ff'},
        'procedure_category': {'colour': '#4c97ff'},
        'text_category': {'colour': '#59c059'},
        'variable_category': {'colour': '#FF8C1A'},
        'variable_dynamic_category': {'colour': '#FF8C1A'},
        'extend_category': {'colour': '#0fbd8c'},
        'basic_category': {'colour': '#4c97ff'},
    },
    'blockStyles': {
        'colour_blocks': {'colourPrimary': '#4c97ff'},
        'list_blocks': {'colourPrimary': '#ffab19'},
        'basic_blocks': {'colourPrimary': '#4c97ff'},
        'logic_blocks': {'colourPrimary': '#4c97ff'},
        'loop_blocks': {'colourPrimary': '#4c97ff'},
        'math_blocks': {'colourPrimary': '#9966ff'},
        'procedure_blocks': {'colourPrimary': '#4c97ff'},
        'text_blocks': {'colourPrimary': '#59c059'},
        'variable_blocks': {'colourPrimary': '#FF8C1A'},
        'variable_dynamic_blocks': {'colourPrimary': '#FF8C1A'},
        'hat_blocks': {'colourPrimary': '#4c97ff', 'hat': 'cap'},
        'error_blocks': { 'colourPrimary': '#FF0000' },
        'extend_blocks': {'colourPrimary': '#0fbd8c'},
    },
    // 'componentStyles': {...},
    // 'fontStyle': {...},
    // 'startHats': true
} as any);

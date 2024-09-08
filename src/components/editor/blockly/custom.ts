import * as Blockly from 'blockly/core';

export class CustomCategory extends Blockly.ToolboxCategory {
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent);
    }

    /**
     * Adds the colour to the toolbox.
     * This is called on category creation and whenever the theme changes.
     * @override
     */
    addColourBorder_(colour) {
        //this.rowDiv_.style.backgroundColor = colour;
    }

    /**
     * Sets the style for the category when it is selected or deselected.
     * @param {boolean} isSelected True if the category has been selected,
     *     false otherwise.
     * @override
     */
    setSelected(isSelected) {
        // We do not store the label span on the category, so use getElementsByClassName.
        const labelDom = this.rowDiv_?.getElementsByClassName('blocklyTreeLabel')[0];
        if (isSelected) {
            // @ts-ignore
            this.rowDiv_.style.backgroundColor = '#E9EEF2';
            // Set the colour of the text to the colour of the category.
            // labelDom.style.color = this.colour_;
            // this.iconDom_.style.color = this.colour_;
        } else {
            // @ts-ignore
            this.rowDiv_.style.backgroundColor = '#FFFFFF';
            // Set the text back to white.
            // labelDom.style.color = 'white';
            // this.iconDom_.style.color = 'white';
        }
        // This is used for accessibility purposes.
        Blockly.utils.aria.setState(
            // @ts-ignore
            /** @type {!Element} */ (this.htmlDiv_),
            Blockly.utils.aria.State.SELECTED,
            isSelected,
        );
    }

    /**
     * Creates the dom used for the icon.
     * @returns {HTMLElement} The element for the icon.
     * @override
     */
    createIconDom_() {
        const iconDiv = document.createElement('div');
        iconDiv.style.width = '20px';
        iconDiv.style.height = '20px'
        iconDiv.style.backgroundColor = this.colour_;
        iconDiv.style.borderRadius = '10px';
        iconDiv.style.backgroundSize = 'cover';
        // iconDiv.style.backgroundImage = "url('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png')";
        iconDiv.style.backgroundPosition = 'center';
        return iconDiv;
    }
}



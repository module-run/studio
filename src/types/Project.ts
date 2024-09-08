export type ProjectRecord = {
    type: EnumProjectType;
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    defaultDevice: string;
    pipDependencies: Array<ProjectPipRecord>;
}

export type ProjectRecordConfig = {
    type: EnumProjectType;
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    defaultDevice: string;
    pipDependencies: Array<ProjectPipRecord>;
}

export type ProjectModuleRecord = {
    name: string;
    title: string;
    author: string;
    description: string;
    logo: string;
    createdAt: number;
    updatedAt: number;
}

export type ProjectModuleDataRecord = {
    codePy: string
    blocklyJson: string
}

export type ProjectModuleRecordConfig = {
    title: string;
    author: string;
    description: string;
    logo: string;
    createdAt: number;
    updatedAt: number;
}

export type ProjectExtendRecord = {
    name: string;
    title: string;
    version: string;
    author: string;
    description: string;
    logo: string;
    require: object,
    function: ProjectExtendRecordFunction[]
}

export type ProjectExtendRecordFunction = {
    name: string;
    title: string;
    params: Array<{
        name: string;
        type: string;
        title: string;
        inputType: "text" | "select" | "number" | "angle" | "checkbox";
        // 参数输入模板，默认为 title {input}
        inputLayoutTemplate: string;
        options: Array<{
            value: string;
            label: string;
        }>
        defaultValue: string;
        description: string;
    }>;
    // 参数输入是否为多行显示
    paramMultiline: boolean;
}

export type ProjectExtendRecordConfig = {
    name: string;
    title: string;
    version: string;
    author: string;
    description: string;
    logo: string;
    require: object,
    function: ProjectExtendRecordFunction[]
}

export type ProjectPipRecord = {
    name: string;
    version: string;
}

export enum EnumProjectType {
    Blockly = 'Blockly',
    Python = 'Python'
}

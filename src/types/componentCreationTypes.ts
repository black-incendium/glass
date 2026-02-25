export type componentsRegistryType = {

    container: {
        init: containerInitDataType
        state: containerStateType
        api: containerApiType
        instance: containerType
    }

    sprite: {
        init: spriteInitDataType
        state: spriteStateType
        api: spriteApiType
        instance: spriteType
    }
}

export type componentsRegisteryKeyType = keyof componentsRegistryType;

export type componentInitDataType<K extends componentsRegisteryKeyType> = componentsRegistryType[K]["init"];
export type componentInstanceType<K extends componentsRegisteryKeyType> = componentsRegistryType[K]["instance"];


// -------------------------------------------CONTAINER-------------------------------------------------

export type containerInitDataType = {

    type?: 'container',
    id: string,
    x?: number,
    y?: number
    scaleX?: number
    scaleY?: number
    scale?: {
        x?: number,
        y?: number
    }
    alpha?: number
    rotation?: number,
    mask?: {
        x?: number,
        y?: number,
        width?: number,
        height?: number,
        isOn?: boolean
    }
    children?: containerInitDataType[]
}

export type containerStateType = {

    type: 'container',
    id: string,
    children: containerType[],
    parent:  containerType | null,
    x: number,
    y: number
    scaleX: number
    scaleY: number
    alpha: number
    rotation: number,
    mask: {
        isOn: boolean,
        x: number,
        y: number,
        width: number,
        height: number,
    }
}

export type containerApiType = {

    addChild: (child: containerType) => void,
    getTotalAlpha: () => number
}

export type containerType = containerApiType & containerStateType;

// ----------------------------------------SPRITE----------------------------------------------------

export type spriteInitDataType = Omit<containerInitDataType, "type"> & {

    type: 'sprite',
    assets?: string[],
    frameIndex?: number
};

export type spriteStateType = Omit<containerStateType, "type"> & {

    type: 'sprite',
    assets: string[],
    frameIndex: number
}

export type spriteApiType = containerApiType & {

    getCurrentAssetName: () => string
}

export type spriteType = spriteApiType & spriteStateType;

// ------------------------------------------ANY--------------------------------------------------

export type anyComponentInitDataType = containerInitDataType | spriteInitDataType;
export type anyComponentType = containerType | spriteType;
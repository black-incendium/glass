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
export type componentStateType<K extends componentsRegisteryKeyType> = componentsRegistryType[K]["state"];

// -------------------BASE---------------------------
export type baseInitDataType = {

    id: string,
    type: componentsRegisteryKeyType,
    x?: number,
    y?: number,
    scaleX?: number,
    scaleY?: number,
    scale?: {
        x?: number,
        y?: number
    } | number,
    alpha?: number,
    rotation?: number,
    mask?: {
        x?: number,
        y?: number,
        width?: number,
        height?: number,
        isOn?: boolean
    },
    children?: anyComponentInitDataType[]
}

export type baseStateType =  {
    
    type: componentsRegisteryKeyType,
    id: string,
    children: anyComponentType[],
    parent:  anyComponentType | null,
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    alpha: number,
    rotation: number,
    mask: {
        isOn: boolean,
        x: number,
        y: number,
        width: number,
        height: number,
    }
}

export type baseApiType = {

    addChild: (child: anyComponentType) => void,
    getTotalAlpha: () => number
}

export type baseComponentType = baseStateType & baseApiType;

// -------------------------------------------CONTAINER-------------------------------------------------

export type containerInitDataType = baseInitDataType & {

    type: 'container',
}

export type containerStateType = baseStateType & {

    type: 'container',
}

export type containerApiType = baseApiType & {

}

export type containerType = containerApiType & containerStateType;

// ----------------------------------------SPRITE----------------------------------------------------

export type spriteInitDataType = baseInitDataType & {

    type: 'sprite',
    assets?: string[],
    frameIndex?: number
};

export type spriteStateType = baseStateType & {

    type: 'sprite',
    assets: string[],
    frameIndex: number
}

export type spriteApiType = baseApiType & {

    getCurrentAssetName: () => string
}

export type spriteType = spriteApiType & spriteStateType;

export type anyComponentType =  baseComponentType | containerType | spriteType
export type anyComponentInitDataType =  containerInitDataType | spriteInitDataType
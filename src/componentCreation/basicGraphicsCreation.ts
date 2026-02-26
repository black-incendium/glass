import { basicGraphicsApiType, basicGraphicsInitDataType, basicGraphicsStateType, basicGraphicsType } from "../types/componentCreationTypes.js";
import { baseComponentApi, getBaseComponentInitState } from "./baseComponentCreation.js";

export  type basicGraphicsDataType = {

    r: number,
    g: number,
    b: number,
    a: number,
    width: number,
    height: number,
};

export const basicGraphicsApi = Object.assign(Object.create(baseComponentApi), {

    getGraphicsData: function(): basicGraphicsDataType {
        
        return {
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a,
            width: this.width,
            height: this.height,
        }
    }

} as basicGraphicsType) as basicGraphicsApiType;

export function getbasicGraphicsInitState(initData: basicGraphicsInitDataType): basicGraphicsStateType {

    const baseInitState = getBaseComponentInitState(initData);

    return {
        ...baseInitState,
        type: "basicGraphics",
        r: initData.r ?? 0,
        g: initData.g ?? 0,
        b: initData.b ?? 0,
        a: initData.a ?? 1,
        width: initData.width ?? 0,
        height: initData.height ?? 0,
    }
}
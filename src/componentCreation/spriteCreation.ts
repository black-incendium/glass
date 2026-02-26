import { spriteApiType, spriteInitDataType, spriteStateType, spriteType } from "../types/componentCreationTypes.js";
import { baseComponentApi, getBaseComponentInitState } from "./baseComponentCreation.js";

export const spriteApi = Object.assign(Object.create(baseComponentApi), {

    getCurrentAssetName: function(): string {

        return this.assets[this.frameIndex] as string;
    }

} as spriteType) as spriteApiType;

export function getSpriteInitState(initData: spriteInitDataType): spriteStateType {

    const baseInitState = getBaseComponentInitState(initData);

    return {
        ...baseInitState,
        type: "sprite",
        frameIndex: initData.frameIndex ?? 0,
        assets: initData.assets ?? [],
    }
}
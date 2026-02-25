import { spriteApiType, spriteInitDataType, spriteStateType, spriteType } from "../types/componentCreationTypes.js";
import { containerApi, getContainerInitState } from "./containerCreation.js";

export const spriteApi = Object.assign(Object.create(containerApi), {

    getCurrentAssetName: function(): string {

        return this.assets[this.frameIndex] as string;
    }

} as spriteType) as spriteApiType;

export function getSpriteInitState(initData: spriteInitDataType): spriteStateType {

    const containerInitState = getContainerInitState({...initData,  type: "container"});

    return {
        ...containerInitState,
        type: "sprite",
        frameIndex: initData.frameIndex ?? 0,
        assets: initData.assets ?? [],
    }
}
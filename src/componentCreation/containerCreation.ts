import { containerApiType, containerInitDataType, containerStateType, containerType} from "../types/componentCreationTypes.js";
import { baseComponentApi, getBaseComponentInitState } from "./baseComponentCreation.js";

export const containerApi = Object.assign(Object.create(baseComponentApi), {

} as containerType) as containerApiType;

export function getContainerInitState(initData: containerInitDataType): containerStateType {

    const baseInitState = getBaseComponentInitState(initData);

    return {
        ...baseInitState,
        type: "container",
    }
}
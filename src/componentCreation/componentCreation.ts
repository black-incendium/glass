import { containerApi, getContainerInitState } from "./containerCreation.js";
import { getSpriteInitState, spriteApi } from "./spriteCreation.js";
import { anyComponentInitDataType, anyComponentType, componentsRegisteryKeyType} from "../types/componentCreationTypes.js";

export const createNewComponent = (() => {

    function createFunction<K extends componentsRegisteryKeyType>(initData: anyComponentInitDataType): anyComponentType | null {

        const type = initData.type ?? "container";

        const children = initData.children?.map(childInitData => {

            return createNewComponent(childInitData);
            //? todo: wrong data + common
        }) ?? [];

        const componentsApisMap = {

            "container": containerApi,
            "sprite": spriteApi
        }

        const componentsInitStateFunctionsMap  = {

            "container": getContainerInitState,
            "sprite": getSpriteInitState
        }

        const api = componentsApisMap[type];
        const initStateFunction = componentsInitStateFunctionsMap[type];

        //@ts-ignore
        return Object.assign(Object.create(api), initStateFunction(initData), {children: children, parent: null})
    }

    return createFunction
})();
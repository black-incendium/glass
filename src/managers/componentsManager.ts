import { containerApi, getContainerInitState } from "../componentCreation/containerCreation.js";
import { getSpriteInitState, spriteApi } from "../componentCreation/spriteCreation.js";
import { anyComponentInitDataType, anyComponentType, containerType } from "../types/componentCreationTypes.js";

export const componentsManager = (()=>{

    let mainGlassContainerInitData = {id:"mainGlassContainer", type:'container', children: []} as anyComponentInitDataType;
    let mainGlassContainer: anyComponentType | null = null;
    let components: Record<string, anyComponentType> = {};

    const createNewComponent = (() => {

        function createFunction(initData: anyComponentInitDataType): anyComponentType | null {

            const children = initData.children?.map(childInitData => {

                return createNewComponent(childInitData);
                //? todo: wrong data + common
            })?.filter(el => el !== null) ?? [];

            let resultObject = null;

            switch (initData.type)  {

                case "container":
                    resultObject = Object.assign(Object.create(containerApi), getContainerInitState(initData), {children: children, parent: null});
                break;

                case "sprite":
                    resultObject = Object.assign(Object.create(spriteApi), getSpriteInitState(initData), {children: children, parent: null});
                break;
            }

            children.forEach(child => {
                child.parent = resultObject
            });

            return resultObject
        }

        return createFunction
    })();

    function initialize(layoutData: anyComponentInitDataType[]) {

        mainGlassContainerInitData.children = layoutData;

        mainGlassContainer = createNewComponent(mainGlassContainerInitData);
    }

    function getComponentsTreeRoot() {

        return mainGlassContainer;
    }

    function getComponentById(id: string): anyComponentType | null {

        return components?.[id] ?? null;
    }

    function getComponents() {

        return components;
    }

    return {

        initialize,
        getComponentsTreeRoot,
        getComponentById,
        getComponents,
        createNewComponent
    }
})();
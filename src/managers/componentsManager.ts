import { containerApi, getContainerInitState } from "../componentCreation/containerCreation.js";
import { getSpriteInitState, spriteApi } from "../componentCreation/spriteCreation.js";
import { anyComponentInitDataType, anyComponentType, containerType } from "../types/componentCreationTypes.js";

export const componentsManager = (()=>{

    let mainGlassContainerInitData = {id:"mainGlassContainer", type:'container', children: []} as anyComponentInitDataType;
    let mainGlassContainer: containerType;
    let components: Record<string, anyComponentType> = {};

    const createNewComponent = (() => {

        function createFunction(initData: anyComponentInitDataType): anyComponentType | null {

            if (components[initData.id]  !== undefined) {

                console.log(`componentsManager: component with the id: ${initData.id} already exists!`);
                return null;
            }

            const children = initData.children?.map(childInitData => {

                return createNewComponent(childInitData);
                //? todo: wrong data + common
            })?.filter(el => el !== null) ?? [];

            let resultObject: anyComponentType;

            switch (initData.type)  {

                case "container":
                    resultObject = Object.assign(Object.create(containerApi), getContainerInitState(initData), {children: children, parent: null});
                break;

                case "sprite":
                    resultObject = Object.assign(Object.create(spriteApi), getSpriteInitState(initData), {children: children, parent: null});
                break;
            }

            children.forEach(child => {
                child!.parent = resultObject
            });

            components[initData.id] = resultObject;

            return resultObject
        }

        return createFunction
    })();

    function initialize(layoutData: anyComponentInitDataType[]): void {

        mainGlassContainerInitData.children = layoutData;

        mainGlassContainer = createNewComponent(mainGlassContainerInitData) as containerType;
    }

    function getComponentsTreeRoot(): containerType {

        return mainGlassContainer;
    }

    function getComponentById(id: string): anyComponentType | null {

        return components[id] ?? null;
    }

    function getComponents(): Record<string, anyComponentType> {

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
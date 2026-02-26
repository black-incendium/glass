import { basicGraphicsApi, getbasicGraphicsInitState } from "../componentCreation/basicGraphicsCreation.js";
import { containerApi, getContainerInitState } from "../componentCreation/containerCreation.js";
import { getSpriteInitState, spriteApi } from "../componentCreation/spriteCreation.js";
import { anyComponentInitDataType, anyComponentType, basicGraphicsType, containerType, spriteType } from "../types/componentCreationTypes.js";

export const componentsManager = (()=>{

    let mainGlassContainerInitData = {id:"mainGlassContainer", type:'container', children: []} as anyComponentInitDataType;
    let mainGlassContainer: containerType;
    let components: Record<string, anyComponentType> = {};

    const createNewComponent = (() => {

        function createFunction<T extends anyComponentInitDataType>(initData: T): Extract<anyComponentType, { type: T["type"] }> | null {

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

                case "container": {
                    resultObject = Object.assign(Object.create(containerApi), getContainerInitState(initData), {children: children, parent: null}) as containerType;
                    // return resultObject as Extract<anyComponentType, { type: T["type"] }>;
                    break;
                }
                    
                case "sprite": {
                    resultObject = Object.assign(Object.create(spriteApi), getSpriteInitState(initData), {children: children, parent: null}) as spriteType;
                    // return resultObject as Extract<anyComponentType, { type: T["type"] }>;
                    break;
                }

                case "basicGraphics": {
                    resultObject = Object.assign(Object.create(basicGraphicsApi), getbasicGraphicsInitState(initData), {children: children, parent: null}) as basicGraphicsType;
                    // return resultObject as Extract<anyComponentType, { type: T["type"] }>;
                    break;
                }
            }

            children.forEach(child => {
                child.parent = resultObject
            });

            components[initData.id] = resultObject;

            switch (resultObject.type)  {

                case "container": 
                    return resultObject as Extract<anyComponentType, { type: T["type"] }>;

                case "sprite": 
                    return resultObject as Extract<anyComponentType, { type: T["type"] }>;

                case "basicGraphics": 
                    return resultObject as Extract<anyComponentType, { type: T["type"] }>;
            }
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
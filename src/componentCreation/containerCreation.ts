import { componentInstanceType, containerApiType, containerInitDataType, containerStateType, containerType } from "../types/componentCreationTypes.js";

export const containerApi = {

    addChild: function(child: componentInstanceType<"container">): void {

        if (child.parent !== null) {

            const index = child.parent.children.indexOf(child);

            if (index === -1) {

                return;
            }

            child.parent.children.splice(index, 1);
        }

        this.children.push(child);
    },

    getTotalAlpha: function(): number {

        const parentTotalAlpha = this.parent?.getTotalAlpha() ?? 1;
        
        return this.alpha * parentTotalAlpha;
    },

} as containerType as containerApiType;

export function getContainerInitState(initData: containerInitDataType): containerStateType {

    //? todo: mask should have isOn: true when any properties of the mask are added

    let scaleX: number;
    let scaleY: number;

    if (typeof initData.scale === "number") {

        scaleX = initData.scaleX ?? initData.scale;
        scaleY = initData.scaleY ?? initData.scale;
    } else if (typeof initData.scale === "object") {

        scaleX = initData.scaleX ?? initData.scale.x ?? 1;
        scaleY = initData.scaleY ?? initData.scale.y ?? 1;
    } else {

        scaleX = initData.scaleX ?? 1;
        scaleY = initData.scaleY ?? 1;
    }

    return {
        type: "container",
        id: initData.id,
        children: [],
        mask: {
            isOn: initData.mask?.isOn ?? false,
            x: initData.mask?.x ?? 0,
            y: initData.mask?.y ?? 0,
            width: initData.mask?.width ?? 100,
            height: initData.mask?.height ?? 100,

        },
        parent: null,
        x: initData.x ?? 0,
        y: initData.y ?? 0,
        scaleX: scaleX,
        scaleY: scaleY,
        alpha: initData.alpha ?? 1,
        rotation: initData.rotation ?? 0
    }
}
import { inputManagerEventsData } from "../eventsData/inputManagerEventsData.js";
import { eventsManager } from "./eventsManager.js";

export const inputManager = (() => {

    const currentlyPressedKeys = new Set<String>();
    const previouslyPressedKeys = new Set<String>();

    window.addEventListener("keydown", (event) => {

        let shouldFireEvent = false;

        if (isKeyPressed(event.code) === false) {

            shouldFireEvent = true
        }

        currentlyPressedKeys.add(event.code);

        if (shouldFireEvent === true) {

            eventsManager.fireEvent<{keyCode: string}>(inputManagerEventsData.keyPressed, {keyCode: event.code});
        }
    });

    window.addEventListener("keyup", (event) => {

        currentlyPressedKeys.delete(event.code);
    });

    window.addEventListener("blur", () => {

      currentlyPressedKeys.clear();
    });

    function updateFrame(): void {

        previouslyPressedKeys.clear();
        currentlyPressedKeys.forEach(keyCode => previouslyPressedKeys.add(keyCode));
    }

    function isKeyPressed(key: string): boolean {

        return currentlyPressedKeys.has(key);
    }

    function wasKeyPressedThisFrame(key: string): boolean {

        return currentlyPressedKeys.has(key) === true && previouslyPressedKeys.has(key) === false;
    }

    function wasKeyReleasedThisFrame(key: string): boolean {

        return currentlyPressedKeys.has(key) === false && previouslyPressedKeys.has(key) === true;
    }

    return {
        updateFrame,
        isKeyPressed,
        wasKeyPressedThisFrame,
        wasKeyReleasedThisFrame,
    }
})();
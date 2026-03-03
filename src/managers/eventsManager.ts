export type eventType = {
    name: string,
    callbackData?: Record<string, any>,
}

export type eventListenerType = {

    eventName: string,
    id: Symbol,
    options: {
        oneTime?: boolean
    },
    callback: Function,
}

export const eventsManager = (()=>{

    let eventListeners: eventListenerType[] = [];

    function fireEvent<eventDataType>(event: eventType, eventData?: eventDataType): void {

        [...eventListeners].forEach(eventListener => {

            if (eventListener.eventName === event.name) {

                eventListener.callback(event, eventData);

                if (eventListener.options.oneTime === true) {

                    removeEventListener(eventListener.id);
                }
            }
        });
    }

    function addEventListener(eventName: string, callback: Function, options?: { oneTime: boolean }) {

        const eventListener = {
            eventName,
            callback,
            options: options ?? {},
            id: Symbol()
        }

        eventListeners.push(eventListener);

        return eventListener.id;
    }

    function removeEventListener(eventListenerId: Symbol) {

        eventListeners = eventListeners.filter(eventListener => eventListener.id !== eventListenerId);
    }

    function getEventListeners() {

        return eventListeners;
    }

    return {

        fireEvent,
        addEventListener,
        removeEventListener,
        getEventListeners
    }

})();
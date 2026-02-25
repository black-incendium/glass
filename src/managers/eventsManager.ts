type eventType = {
    eventName: string,
    callbackData: Record<string, any>,
}

type eventListenerType = {

    eventName: string,
    id: Symbol,
    options: {
        oneTime?: boolean
    },
    callback: Function,
}

export const eventsManager = (()=>{

    let eventListeners: eventListenerType[] = [];

    function fireEvent(event: eventType): void {

        [...eventListeners].forEach(eventListener => {

            if (eventListener.eventName === event.eventName) {

                eventListener.callback(event.callbackData, event);

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

    return {

        fireEvent,
        addEventListener,
        removeEventListener
    }

})();
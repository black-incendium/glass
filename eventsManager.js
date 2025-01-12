export const eventsManager = (()=>{

    let eventListeners = [];

    function fireEvent(event) {

        [...eventListeners].forEach(eventListener => {

            if (eventListener.eventId === event.id) {

                eventListener.callback(event.callbackData, event);

                if (eventListener.options.oneTimeEvent === true) {

                    removeEventListener(eventListener.id);
                }
            }
        });
    }

    function addEventListener(eventId, callback, options = {}) {

        const eventListener = {
            eventId,
            callback,
            options,
            id: Symbol()
        }

        eventListeners.push(eventListener);

        return eventListener.id;
    }

    function removeEventListener(eventListenerId) {

        eventListeners = eventListeners.filter(eventListener => eventListener.id !== eventListenerId);
    }

    return {

        fireEvent,
        addEventListener,
        removeEventListener
    }

})();
export const appStateManager = (()=>{

    let appWidth: number;
    let appHeight: number;

    function initialize(appData: {width: number, height: number}) {

        appWidth = appData.width;
        appHeight = appData.height;
    }

    function getAppSize() {

        return ({
            width: appWidth,
            height: appHeight
        });
    }

    return {

        initialize,
        getAppSize
    }
})();
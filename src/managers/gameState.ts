export const gameState = (()=>{

    let gameWidth: number;
    let gameHeight: number;

    function initialize(gameData: {width: number, height: number}) {

        gameWidth = gameData.width;
        gameHeight = gameData.height;
    }

    function getGameSize() {

        return ({
            width: gameWidth,
            height: gameHeight
        });
    }

    return {

        initialize,
        getGameSize
    }
})();
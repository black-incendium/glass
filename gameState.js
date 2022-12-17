export const gameState = (()=>{

    let gameWidth;
    let gameHeight;

    function initialize(gameData) {

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
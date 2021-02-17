
var waitingList = [];
var gamesList = [];

const addPlayerWaiting = (username) => {
    waitingList.push(username);
}

const removePlayerWaiting = (username) => {
    let index = array.indexOf(username);

    if (index > -1)
        array.splice(index, 1);
    else
        return -1;
}

const matchPlayers = () => {
    // Tentative de mettre deux joueurs ensembles avec le moins d'écart d'élo possible


}

const createGame = async (whitePlayer, blackPlayer) => {
    // ID généré par elastic search

    var game = {
        id: {
            whiteUser: whitePlayer,
            blackUser: blackPlayer,
            startTime: Date.now(),
            playerTurn: 0,
            cases: await createCases()
        }
    }

    gamesList.push(game);
}

const checkMoveIsValid = (gameId, username, sourceCase, targetCase) => {

}

function createCases() {
    var cases = {};
    let rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    let cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; let colIndex = 1;

    rows.forEach(row => {
        colIndex = 1;

        cols.forEach(col => {
            if (row < 5) { // Blancs
                if (row % 2 == colIndex % 2)    cases[col+row] = 1;
                else                            cases[col+row] = 0;
            } else if (row > 6) { // Noirs
                if (row % 2 == colIndex % 2)    cases[col+row] = 2;
                else                            cases[col+row] = 0;
            } else 
                cases[col+row] = 0;

            colIndex++;
        });
    });

    return cases;
}

export default {
    
};
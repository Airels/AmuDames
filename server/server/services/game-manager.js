const semaphore = require('semaphore')(1);

var waitingList = new Array();
var gameList = new Array();

function tryMatch() {
    if (waitingList.length < 2) return;

    semaphore.take(() => {
        let p1 = waitingList.shift();
        let p2 = undefined;
        let eloDiff = 0;

        for (let player of waitingList) {
            if (p2 === undefined) {
                p2 = player;
                eloDiff = Math.abs(p1.elo - p2.elo);
            }

            if (Math.abs(p1.elo - player.elo) < eloDiff) {
                p2 = player;
                eloDiff = Math.abs(p1.elo - p2.elo);
            }
        }

        if (p2 !== undefined) {
            removePlayerWaiting(p2)
            semaphore.leave();
            matchPlayers(p1, p2);
        }
    });
}

function matchPlayers(p1, p2) {
    console.log("IT'S A MATCH!");
    console.log(p1.username + " vs " + p2.username);
    
    p1.callback({ status: 201 });
    p2.callback({ status: 201 });
}

const addPlayerWaiting = (user, callback) => {
    semaphore.take(() => {
        if (waitingList.find(u => u.username == user.username)) {
            callback({ status: 409 });
            semaphore.leave();
            return;
        }

        user.callback = callback;

        waitingList.push(user);
        semaphore.leave();
        tryMatch();
    });
}

const removePlayerWaiting = (user) => {
    let index = waitingList.indexOf(user);

    console.log("index: " + index);
    console.log("length: " + waitingList.length);

    if (index > -1)
        waitingList.splice(index);
    else
        return -1;

    console.log("new length: " + waitingList.length);
}

const createGame = async (whitePlayer, blackPlayer) => {
    // ID généré par elastic search
    let id = 0;
    
    var game = new Game(id, whitePlayer, blackPlayer, Date.now(), await createCases());
    gamesList.push(game);
}

const checkMoveIsValid = (gameID, username, sourceCase, targetCase) => {
    var game = game[gameID];
    
    if (game == undefined)  return 0;
    if (game.playerTurn == 0 && game.whiteUser != username) return 0;
    if (game.playerTurn == 1 && game.blackUser != username) return 0;

    var cases = game.cases;

    if (cases[targetCase] != 0) return 0;
    if (cases[sourceCase] == 0) return 0;

    if (getPossibleMoves(sourceCase).includes(targetCase))
        return 1;
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

function getPossibleMoves(source) {

}

export default {
    addPlayerWaiting,
    removePlayerWaiting,
    matchPlayers,
    createGame,
    checkMoveIsValid
};
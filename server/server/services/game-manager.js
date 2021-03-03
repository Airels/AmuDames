import utils from '../utils';
import Game from '../models/game.models';
const semaphore = require('semaphore')(1);

const waitingList = new Array();
const gamesList = new Array();

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

    if (index > -1)
        waitingList.splice(index);
    else
        return -1;
}

async function matchPlayers(p1, p2) {
    console.log("IT'S A MATCH!");
    console.log(p1.username + " vs " + p2.username);

    let res = await createGame(p1, p2);

    p1.callback({ status: 201, id: res.id, playerID: 0, game: res.game });
    p2.callback({ status: 201, id: res.id, playerID: 1, game: res.game });
}

const createGame = async (whitePlayer, blackPlayer) => {
    let id = await utils.makeid(10);
    let cases = await createCases();

    var game = new Game(id, whitePlayer, blackPlayer, Date.now(), cases);
    gamesList.push(game);
    return {
        id: id,
        game: game
    };
}

const getGame = async (gameID) => {
    let game = gamesList.find(game => game.id == gameID);

    if (game === undefined) {
        return undefined;
    }

    return game;
}

const checkMoveIsValid = async (gameID, email, sourceCase, targetCase) => {
    var game = game[gameID];
    
    if (game == undefined)  return 0;
    if (game.playerTurn == 0 && game.whiteUser.email != email) return 0;
    if (game.playerTurn == 1 && game.blackUser.email != email) return 0;

    var cases = game.cases;

    if (cases[targetCase] != 0) return 0;
    if (cases[sourceCase] == 0) return 0;

    let possibleMoves = await getPossibleMoves(sourceCase);

    if (possibleMoves.includes(targetCase))
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

async function getPossibleMoves(source, playerID) { // PlayerID = 0 -> white, PlayerID = 1 -> black
    let cols = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    let possibilities = [];

    if (playerID == 0) {
        source.col = cols.indexOf(source.col);

        if (source.col == 1) {
            possibilities.add({
                row: source.row+1, 
                col: cols[source.col+1]
            });
        } else if (source.col == 10) {
            possibilities.add({
                row: source.row+1, 
                col: cols[source.col-1]
            });
        } else {
            possibilities.add({
                row: source.row+1, 
                col: cols[source.col+1]
            });
            possibilities.add({
                row: source.row+1, 
                col: cols[source.col-1]
            });
        }
    } else if (playerID == 1) {
        if (source.col == 1) {
            possibilities.add({
                row: source.row-1, 
                col: cols[source.col+1]
            });
        } else if (source.col == 10) {
            possibilities.add({
                row: source.row-1, 
                col: cols[source.col-1]
            });
        } else {
            possibilities.add({
                row: source.row-1, 
                col: cols[source.col+1]
            });
            possibilities.add({
                row: source.row-1, 
                col: cols[source.col-1]
            });
        }
    } else {
        return [];
    }

    return possibilities;
}

export default {
    addPlayerWaiting,
    removePlayerWaiting,
    matchPlayers,
    getGame,
    createGame,
    checkMoveIsValid
};
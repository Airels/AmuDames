import utils from '../utils';
import Game from '../models/game.models';
import esdb from './es-users';
const semaphore = require('semaphore')(1);
const EloRating = require('elo-rating');

const waitingList = new Array();
const gamesList = new Array();
const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; 

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
            removePlayerForMatch(p2);
            semaphore.leave();
            matchPlayers(p1, p2);
        } else { 
            semaphore.leave();
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

const removePlayerWaiting = (user, callback) => {
    let p = waitingList.splice(user)[0];
    p.callback({ status: 205 }); // Answer to add request
    callback();
}

function removePlayerForMatch(user) {
    waitingList.splice(user);
}

async function matchPlayers(p1, p2) {
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

const checkMoveIsValid = async (gameID, playerID, sourceCase, targetCase) => {
    let result = [];
    let game = await gamesList.find((game) => game.id == gameID);
    let eatMove, opponentCase;

    if (game === undefined)  return 0;                              // Si la game n'existe pas
    if (game.playerTurn != playerID) return 0;                      // Si ce n'est pas le tour du bon joueur

    let cases = game.cases;

    if (cases[targetCase.col + targetCase.row] != 0) return 0;      // Si la case cible n'est pas vide
    if (cases[sourceCase.col + sourceCase.row] == 0) return 0;      // Si la case source est vide

    let possibleMoves;
    let queenMove = (cases[sourceCase.col + sourceCase.row] == 3 || cases[sourceCase.col + sourceCase.row] == 4);

    if (queenMove) {                                                    // S'il s'agit d'une dame
        possibleMoves = await getPossibleQueenMoves(sourceCase, gameID);
        console.log("QUEEN: " + JSON.stringify(possibleMoves));
    } else {
        eatMove = Math.abs(sourceCase.row - targetCase.row) == 2;       // Si la distance entre la source du pion et sa case cible est de 2 cases, alors c'est qu'il veut manger
        possibleMoves = await getPossibleMoves(sourceCase, playerID);   // Récupération des moves possibles pour ce pion
    }

    if (!(await containsMove(possibleMoves, targetCase))) return 0;         // Si le mouvement demandé est illégal

    if (queenMove) {
        let vector = {
            row: targetCase.row - sourceCase.row,
            col: cols.indexOf(targetCase.col) - cols.indexOf(sourceCase.col)
        }

        console.log("VECTOR: " + JSON.stringify(vector));

        if (vector.row > 1 && vector.col > 1) {
            opponentCase = {
                row: targetCase.row-1,
                col: cols[cols.indexOf(targetCase.col)-1]
            }
        } else if (vector.row < -1 && vector.col > 1) {
            opponentCase = {
                row: targetCase.row+1,
                col: cols[cols.indexOf(targetCase.col)-1]
            }
        } else if (vector.row < -1 && vector.col < -1) {
            opponentCase = {
                row: targetCase.row+1,
                col: cols[cols.indexOf(targetCase.col)+1]
            }
        } else if (vector.row > 1 && vector.col < -1) {
            opponentCase = {
                row: targetCase.row-1,
                col: cols[cols.indexOf(targetCase.col)+1]
            }
        }

        if (opponentCase !== undefined) {
            if (cases[opponentCase.col + opponentCase.row] == playerID+1 || cases[opponentCase.col + opponentCase.row] == playerID+3) return 0;
        
            if (cases[opponentCase.col + opponentCase.row] != 0) {
                opponentCase.value = 0;
                cases[opponentCase.col + opponentCase.row] = 0;

                result.push(opponentCase);
            }
        }
    } else {
        if (eatMove) {
            let col = cols[((cols.indexOf(sourceCase.col) + cols.indexOf(targetCase.col))/2)];
            let row = ((sourceCase.row + targetCase.row)/2);
    
            opponentCase = cases[col+row];
    
            if (opponentCase == 0 || opponentCase == playerID+1 || opponentCase == playerID+3) return 0;
    
            cases[col+row] = 0;
            
            result.push({
                row: row,
                col: col,
                value: 0
            });
        }
    }

    if (targetCase.row == 9) {                          // Deviens une Dame Blanche
        targetCase.value = 3;
        cases[targetCase.col + targetCase.row] = 3;
    } else if (targetCase.row == 0) {                   // Deviens une Dame Noire
        targetCase.value = 4;
        cases[targetCase.col + targetCase.row] = 4;
    } else {                                            // Déplace le pion source sur la cible
        targetCase.value = cases[sourceCase.col + sourceCase.row];
        cases[targetCase.col + targetCase.row] = cases[sourceCase.col + sourceCase.row];
    }

    sourceCase.value = 0;
    cases[sourceCase.col + sourceCase.row] = 0;

    result.push(sourceCase, targetCase);
    game.playerTurn = (game.playerTurn+1) % 2;
    return result;
}

async function getPossibleMoves(source, playerID) { // PlayerID = 0 -> white, PlayerID = 1 -> black
    let possibilities = [];
    source.col = cols.indexOf(source.col);

    if (playerID == 0) {
        if (source.col == 0) {
            possibilities.push({
                row: source.row+1, 
                col: cols[source.col+1]
            }, {
                row: source.row+2,
                col: cols[source.col+2]
            });
        } else if (source.col == 9) {
            possibilities.push({
                row: source.row+1, 
                col: cols[source.col-1]
            }, {
                row: source.row+2,
                col: cols[source.col-2]
            });
        } else {
            possibilities.push({
                row: source.row+1, 
                col: cols[source.col+1]
            }, {
                row: source.row+2, 
                col: cols[source.col+2]
            });
            possibilities.push({
                row: source.row+1, 
                col: cols[source.col-1]
            }, {
                row: source.row+2, 
                col: cols[source.col-2]
            });
        }
    } else if (playerID == 1) {
        if (source.col == 0) {
            possibilities.push({
                row: source.row-1, 
                col: cols[source.col+1]
            }, {
                row: source.row-2, 
                col: cols[source.col+2]
            });
        } else if (source.col == 9) {
            possibilities.push({
                row: source.row-1, 
                col: cols[source.col-1]
            }, {
                row: source.row-2, 
                col: cols[source.col-2]
            });
        } else {
            possibilities.push({
                row: source.row-1, 
                col: cols[source.col+1]
            }, {
                row: source.row-2, 
                col: cols[source.col+2]
            });
            possibilities.push({
                row: source.row-1, 
                col: cols[source.col-1]
            }, {
                row: source.row-2, 
                col: cols[source.col-2]
            });
        }
    } else {
        return [];
    }

    source.col = cols[source.col];
    return possibilities;
}

async function getPossibleQueenMoves(source, gameID) {
    let cases;
    gamesList.forEach((game) => {
        if (game.id == gameID) {
            cases = game.cases;
            return;
        }
    });

    let possibilities = [];
    source.col = cols.indexOf(source.col);

    /* 
        - de row à 10 & col à 10 -> cas 1
        - de row à 10 & col à 0  -> cas 2
        - de row à 0 & col à 10  -> cas 3
        - de row à 0 & col à 0   -> cas 4
    */

    let row, col;

    for (row = source.row+1, col = source.col+1; row < 10 || col < 10; row++, col++) {
        let value = cases[cols[col]+row];

        if (value == 0) {
            possibilities.push({
                row: row,
                col: cols[col]
            })
        } else {
            if (((row+1) > 9) || (cols[col+1] == undefined)) break;

            possibilities.push({
                row: row+1,
                col: cols[col+1]
            });
            break;
        }
    }

    for (row = source.row-1, col = source.col+1; row > -1 || col < 10; row--, col++) {
        let value = cases[cols[col]+row];

        if (value == 0) {
            possibilities.push({
                row: row,
                col: cols[col]
            })
        } else {
            if (((row-1) < 0) || (cols[col+1] == undefined)) break;

            possibilities.push({
                row: row-1,
                col: cols[col+1]
            });
            break;
        }
    }

    for (row = source.row-1, col = source.col-1; row > -1 || col > -1; row--, col--) {
        let value = cases[cols[col]+row];

        if (value == 0) {
            possibilities.push({
                row: row,
                col: cols[col]
            })
        } else {
            if (((row-1) < 0) || (cols[col-1] == undefined)) break;

            possibilities.push({
                row: row-1,
                col: cols[col-1]
            });
            break;
        }
    }

    for (row = source.row+1, col = source.col-1; row < 10 || col > -1; row++, col--) {
        let value = cases[cols[col]+row];

        if (value == 0) {
            possibilities.push({
                row: row,
                col: cols[col]
            })
        } else {
            if (((row+1) > 9) || (cols[col-1] == undefined)) break;

            possibilities.push({
                row: row+1,
                col: cols[col-1]
            });
            break;
        }
    }

    /*
        - Peut se déplacer en diagonale de manière illimité
        - Peut manger UN SEUL et UNIQUE pion
        - Si deux pions sur le chemin, déplacement impossible
        - Si pion mangé, doit se trouver JUSTE après lui
    */

    source.col = cols[source.col];
    return possibilities;
}


async function containsMove(possibleMoves, targetCase) {
    let found = false;
    possibleMoves.forEach((move) => {
        if (move.row == targetCase.row && move.col == targetCase.col) {
            found = true;
            return;
        }
    });

    return found;
}

async function checkIfSomeoneWon(gameID) {
    let rows = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let cases;
    let whitePawnDetected = false;
    let blackPawnDetected = false;

    gamesList.forEach((game) => {
        if (game.id == gameID) {
            cases = game.cases;
            return;
        }
    });

    if (cases === undefined)
        throw new Error('An error occured during verification of checkIfSomeoneWon (1)');

    for (let row of rows) {
        if (whitePawnDetected && blackPawnDetected) break;

        for (let col of cols) {
            if (whitePawnDetected && blackPawnDetected) break;

            let value = cases[col+row];

            switch (value) {
                case 0:
                    break;
                case 1:
                case 3:
                    whitePawnDetected = true;
                    break;
                case 2:
                case 4:
                    blackPawnDetected = true;
                    break;
                default:
                    console.log(typeof(value));
                    console.log(col + "" + row)
                    throw new Error(`An error occured during verification of checkIfSomeoneWon (2) (${value})`);
            }
        }
    }

    let result = -1;

    if (!whitePawnDetected)
        result = 1;
    else if (!blackPawnDetected)
        result = 0;

    return result;
}

async function createCases() {
    let rows = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var cases = [];
        let colIndex;
    
        rows.forEach(row => {
            colIndex = 0;
    
            cols.forEach(col => {
                if (row < 4) { // Blancs
                    if (row % 2 == colIndex % 2)    cases[col+row] = 1;
                    else                            cases[col+row] = 0;
                } else if (row > 5) { // Noirs
                    if (row % 2 == colIndex % 2)    cases[col+row] = 2;
                    else                            cases[col+row] = 0;
                } else 
                    cases[col+row] = 0;
    
                colIndex++;
            });
        });
    
        return cases;
}

const endGame = async (gameID, winnerID) => {
    let found = false;
    // Push la game sur elasticsearch
    gamesList.forEach((game) => {
        if (game.id == gameID) {
            gamesList.splice(game);
            found = true;

            let p1 = game.whiteUser;
            let p2 = game.blackUser;

            let eloResult = EloRating.calculate(p1.elo, p2.elo, (winnerID == 0));

            esdb.setElo(p1.email, eloResult.playerRating);
            esdb.setElo(p2.email, eloResult.opponentRating);
            return;
        }
    });

    return found;
}

export default {
    addPlayerWaiting,
    removePlayerWaiting,
    matchPlayers,
    getGame,
    createGame,
    checkMoveIsValid,
    checkIfSomeoneWon,
    endGame
};
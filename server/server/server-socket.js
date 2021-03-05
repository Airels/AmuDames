import { Server } from 'ws';
import gameManager from './services/game-manager';
import usersHandler from './services/users-handler';
import ClientSocket from './models/client-socket.models';

const serverSocket = new Server({port: 8085});

const clients = []; // List of client-socket

serverSocket.on('connection', (ws) => {
    var gameID, playerID, connected = false;

    ws.on('message', (message) => {
        let args;

        if (message.startsWith('CONNECT')) {
            args = message.split(' ');

            if (args.length != 4) {
                ws.send('Invalid syntax.');
                return;
            }

            gameID = args[1];
            let mail = args[2];

            gameManager.getGame(gameID).then((game) => {
                if (game === undefined) ws.send('ERR: GAME (' + gameID + ') UNKNOWN');
                else {
                    ws.send('GAME FOUND, CONNECTING...');

                    if (game.whiteUser.email == mail) {
                        playerID = 0;
                        clients.push(new ClientSocket(ws, gameID));
                        connected = true;
                        ws.send('CONNECTED');
                        ws.send('HELLO PLAYER 1');
                    } else if (game.blackUser.email == mail) {
                        playerID = 1;
                        clients.push(new ClientSocket(ws, gameID));
                        connected = true;
                        ws.send('CONNECTED');
                        ws.send('HELLO PLAYER 2');
                    } else ws.send('ERR: CONNECTION DENIED');
                }
            });
        } else if (message.startsWith('MOVE')) {
            if (!connected) {
                ws.send('ERR: NOT CONNECTED YET. PLEASE USE "CONNECT" FIRST');
                return;
            }

            args = message.split(' ');

            if (args.length != 3) {
                ws.send('Invalid syntax.');
                return;
            }

            let source = args[1];
            let target = args[2];

            gameManager.checkMoveIsValid(gameID, playerID, source, target).then(result => {
                if (result !== 0) {
                    // Broadcast nouveaux états de la case source et la case target + autres possibles cases (mangeage etc...)
                    // let msg = result.split(' ')

                    // ws.broadcast('UPDATE {{1}, {2}, {3}}');
                    serverSocket.broadcast(gameID, undefined);
                    console.log('VALID');
                }
            });
        } else if (message = 'INFO') {
            ws.send('501 - Not Implemented Yet');
        } else if (message == 'HELP') {
            ws.send("Available commands:\n"
            + "CONNECT <Game ID> <E-Mail> - To connect to a game\n"
            + "MOVE <source pawn> <target pawn> - To move a pawn\n"
            + "INFO - To display informations you submitted\n"
            + "HELP - I mean.. it's obvious what this command do...");
        } else if (message == 'QUIT') {
            clients.forEach((clientSocket) => {
                if (clientSocket.socket == ws) {
                    clients.splice(clientSocket);
                    ws.send('GOODBYE');
                    return;
                }
            });
        } else {
            ws.send('Request unrecognized');
        }
    });

    ws.send("AmuDames Game Manager");
    console.log("A client connected");
});



serverSocket.broadcast = function broadcast(gameID, moves) {
    let i = 0;
    clients.forEach((clientSocket) => {
        if (i >= 2) return;

        if (clientSocket.gameID == gameID) {
            clientSocket.socket.send('UPDATE');
            i++;
        }
    });
};
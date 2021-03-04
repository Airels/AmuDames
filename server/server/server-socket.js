import { Server } from 'ws';
import gameManager from './services/game-manager';
import usersHandler from './services/users-handler';

const serverSocket = new Server({port: 8085});

serverSocket.on('connection', (ws) => {
    var gameID, playerID, connected = false;

    ws.on('message', (message) => {
        let args;

        if (message.startsWith('CONNECT')) {
            args = message.split(' ');

            if (args.length != 4) {
                ws.send("Invalid syntax.")
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
                        connected = true;
                        ws.send('CONNECTED');
                        ws.send('HELLO PLAYER 1');
                    } else if (game.blackUser.email == mail) {
                        playerID = 1;
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
            source = args[1];
            target = args[2];

            gameManager.checkMoveIsValid(gameID, username, source, target).then(result => {
                if (result == 1) {
                    // Broadcast nouveaux états de la case source et la case target + autres possibles cases (mangeage etc...)
                }
            });
        } else if (message = 'INFO') {
            ws.send('501 - Not Implemented Yet');
        }else if (message == 'HELP') {
            ws.send("Available commands:\n"
            + "CONNECT <Game ID> <E-Mail> - To connect to a game\n"
            + "MOVE <source pawn> <target pawn> - To move a pawn\n"
            + "INFO - To display informations you submitted\n"
            + "HELP - I mean.. it's obvious what this command do...");
        } else {
            ws.send('Request unrecognized');
        }
    });

    ws.send("AmuDames Game Manager");
    console.log("A client has connect");
});
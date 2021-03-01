import { Server } from 'ws';
import gameManager from './services/game-manager';

const serverSocket = new Server({port: 8085});

serverSocket.on('connection', (ws) => {
    var gameID, username;

    ws.on('message', (message) => {
        if (message.startsWith('CONNECT')) {
            if (args.length != 4) {
                ws.send("Missing arguments.")
                return;
            }

            args = message.split(' ');
            gameID = args[1];
            username = args[2];
            password = args[3];

            // Connect
        } else if (message.startsWith('MOVE')) {
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
            + "CONNECT <Game ID> <Username> <Password> - To connect to a game\n"
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
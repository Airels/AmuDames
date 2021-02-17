import { Server } from 'ws';

const serverSocket = new Server({port: 8085});

serverSocket.on('connection', (ws) => {
    var gameID, username;

    ws.on('message', (message) => {
        if (message.startsWith('CONNECT')) {
            args = message.split(' ');
            gameID = args[1];
            username = args[2];

            // connect to game
        } else if (message.startsWith('MOVE')) {
            args = message.split(' ');
            source = args[1];
            target = args[2];

            // check move
        } else if (message == 'HELP') {
            ws.send("Available commands:\n"
            + "CONNECT <Game ID> <Username> - To connect to a game\n"
            + "MOVE <source pawn> <target pawn> - To move a pawn\n"
            + "HELP - I mean.. it's obvious what this command do...");
        } else {
            ws.send('Request unrecognized');
        }
    });

    ws.send("AmuDames Game Manager");
    console.log("A client has connect");
});
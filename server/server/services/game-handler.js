import esdb from './es-users.js';

async function createGame(req, res) {
    res.sendStatus(501);
}

async function getGame(req, res) {
    res.sendStatus(501);
}

async function updateGame(req, res) {
    res.sendStatus(501);
}

async function getGame(req, res) {
    res.sendStatus(403);
}

export default {
    createGame,
    getGame,
    updateGame,
    deleteGame
};
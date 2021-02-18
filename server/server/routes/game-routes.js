import express from 'express';

const gameRouter = express.Router();

gameRouter.use((req, res, next) => { // CHECK IF USER CONNECTED
    if (req.session.username == undefined) res.sendStatus(401)
    else next();
});

gameRouter.get('/', (req, res) => {
    res.send('Welcome to party route !');
});

gameRouter.get('/search/start', (req, res) => {
    res.sendStatus(501);

    // Recherche un joueur dans la liste de joueurs en attente
});

gameRouter.get('/search/stop', (req, res) => {
    res.sendStatus(501);

    // Arrête la recherche d'une partie pour le joueur
});

export default gameRouter;
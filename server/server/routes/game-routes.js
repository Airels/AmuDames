import express from 'express';
import gameManager from '../services/game-manager';

const gameRouter = express.Router();

gameRouter.use((req, res, next) => { // CHECK IF USER CONNECTED
    if (req.session.user.username == undefined) res.sendStatus(401)
    else next();
});

gameRouter.get('/', (req, res) => {
    res.send('Welcome to party route !');
});

gameRouter.get('/search/start', (req, res) => {
    gameManager.addPlayerWaiting(req.session.user, (result) => {
        res.json(result);
        res.end();
    });
});

gameRouter.get('/search/stop', (req, res) => {
    if (req.session.user === undefined) return;
    gameManager.removePlayerWaiting(req.session.user, () => {
        res.json({ status: 200 });
        res.end();
    });
});

export default gameRouter;
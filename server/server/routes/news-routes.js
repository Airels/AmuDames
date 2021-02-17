import express from 'express';

const gameRouter = express.Router();

gameRouter.get('/', (req, res) => {
    res.send('Welcome to news route !');
});

export default gameRouter;
import express from 'express';

const gameRouter = express.Router();

gameRouter.get('/:nbOfNews', (req, res) => {
    res.send(`Get ${req.params.nbOfNews} news`);
});

export default gameRouter;
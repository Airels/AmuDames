import express from 'express';

const explRouter = express.Router();

explRouter.get('/', (req, res) => {
    res.send('Welcome to example route !');
});

export default explRouter;
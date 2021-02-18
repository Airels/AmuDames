import express from 'express';
import usersHandler from '../services/users-handler'

const usersRouter = express.Router();

usersRouter.use((req, res, next) => { // CHECK IF USER CONNECTED
    if (req.session.username == undefined) res.sendStatus(401)
    else next();
});

usersRouter.get('/', usersHandler.getUser);
usersRouter.post('/', usersHandler.addUser);
usersRouter.put('/', usersHandler.updateUser);
usersRouter.delete('/', usersHandler.delete);

usersRouter.get('/id/:id', (req, res) => { res.status(449).send("Username"); });
usersRouter.get('/username/:username', usersHandler);

export default usersRouter;
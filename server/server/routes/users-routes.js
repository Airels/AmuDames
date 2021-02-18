import express from 'express';
import asyncHandler from 'express-async-handler';
import usersHandler from '../services/users-handler';

const usersRouter = express.Router();

usersRouter.use((req, res, next) => { // CHECK IF USER CONNECTED
    if (req.session.username == undefined) res.sendStatus(401)
    else next();
});

usersRouter.get('/', asyncHandler(usersHandler.getUser));
usersRouter.post('/', asyncHandler(usersHandler.addUser));
usersRouter.put('/', asyncHandler(usersHandler.updateUser));
usersRouter.delete('/', asyncHandler(usersHandler.deleteUser));

usersRouter.get('/id/:id', (req, res) => { res.status(449).send("Username"); });
usersRouter.get('/username/:username', asyncHandler(usersHandler.getUsers));

export default usersRouter;
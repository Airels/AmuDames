import express from 'express';
import usersHandler from '../services/users-handler'

const usersRouter = express.Router();

usersRouter.use((req, res, next) => { // CHECK IF USER CONNECTED
    if (req.session.username == undefined) res.sendStatus(401)
    else next();
});

usersRouter.route('/')
    .get(usersHandler.updateUser)
    .delete(usersHandler.deleteUser);

export default usersRouter;
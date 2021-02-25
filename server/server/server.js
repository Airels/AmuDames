/*
    CODE CREATED BY :
    YUN Eunsun,
    IKHLEF Eddy,
    PIERRARD Kévin,
    VIZCAINO Yohan,
*/

import express from 'express';
import session from 'express-session';
import asyncHandler from 'express-async-handler';
import serverSocket from './server-socket';
import usersHandler from './services/users-handler';
import usersRouter from './routes/users-routes';
import explRouter from './routes/expl-routes';
import gameRouter from './routes/game-routes';
import newsRouter from './routes/news-routes';

const app = express();
var sess = {
    secret: 'casino cest pas que des mots',
    cookie: { secure: false }
}

app.use(express.json());
app.use(session(sess));
app.use(express.static('./app/AmuDames/'));

// Routers
app.use('/expl', explRouter);
app.use('/game', gameRouter);
app.use('/news', newsRouter);
app.use('/users', usersRouter);

// Main route
/* Inutile
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
*/

app.get('/home', (req, res) => {
    res.redirect('/');
});

app.post('/register', asyncHandler(usersHandler.addUser)); 

app.post('/login', asyncHandler(usersHandler.login));

app.listen(8080, () => console.log("Amudames opened on port 8080"));

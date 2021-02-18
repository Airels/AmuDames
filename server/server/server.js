/*
    CODE CREATED BY :
    YUN Eunsun,
    IKHLEF Eddy,
    PIERRARD Kévin,
    VIZCAINO Yohan,
*/

import express from 'express';
import session from 'express-session';
import usersRouter from './routes/users-routes';
import explRouter from './routes/expl-routes';
import gameRouter from './routes/game-routes';
import newsRouter from './routes/news-routes';
import serverSocket from './server-socket';

const app = express();
var sess = {
    secret: 'casino cest pas que des mots',
    cookie: { secure: true }
}

app.use(express.json());
app.use(session(sess));
app.use(express.static('./app/AmuDames/'));

// Routers
app.use('/users', usersRouter);
app.use('/expl', explRouter);
app.use('/game', gameRouter);
app.use('/news', newsRouter);

// Main route
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/register', usersHandler.addUser); 

app.post('/login', usersHandler.login);

app.listen(8080, () => console.log("Amudames opened on port 8080"));

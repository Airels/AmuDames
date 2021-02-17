import express from 'express';
import session from 'express-session';
import usersHandler from './services/users-handler';
import explRouter from './routes/expl-routes';
import gameRouter from './routes/game-routes';

const app = express();
var sess = {
    secret: 'casino cest pas que des mots',
    cookie: { secure: true }
}

app.use(express.json());
app.use(session(sess));
app.use(express.static('./app/AmuDames/'));

// Routers
app.use('/expl', explRouter);
app.use('/game', gameRouter);

// Main route
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/register', usersHandler.addUser); 

app.post('/login', usersHandler.login);

app.use((req, res, next) => { // CHECK IF USER CONNECTED
    if (req.session.username == undefined) res.sendStatus(401)
    else next();
});

app.route('/user')
    .get(usersHandler.updateUser)
    .delete(usersHandler.deleteUser);

app.listen(8080, () => console.log("Amudames opened on port 8080"));

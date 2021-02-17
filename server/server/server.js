import express from 'express';
import session from 'express-session';
import usersHandler from './services/users-handler';
import explRouter from './routes/expl-routes';

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

app.put('/user', usersHandler.updateUser);

app.delete('/user', usersHandler.deleteUser);

app.listen(8080, () => console.log("Amudames opened on port 8080"));

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

app.put('/update', usersHandler.updateUser);

app.listen(8080);

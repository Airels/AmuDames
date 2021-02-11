import express from 'express';
import explRouter from './routes/expl-routes'

const app = express();

app.use(express.json());
app.use(express.static('./app/AmuDames/'));

// Routers
app.use('/expl', explRouter);

// Main route
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(8080);

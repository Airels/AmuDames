import esdb from './es-users.js';
import User from '../models/users.models.js'

async function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let result = await esdb.userLogin(email, password);

        if (result.body.hits.total.value > 0) {
            let user = result.body.hits.hits[0]._source;
            user.password = undefined;

            console.log(user);

            req.session.user = user;
            res.status(200).json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log("An error occured during login: ", e);
    }
}

async function addUser(req, res) {
    let username = req.body.username;
    let passwd = req.body.password;
    let email = req.body.email;
    let default_elo = 800;
    let country = req.body.country;
    let default_profileImageURL = req.body.profileImageURL;
    let default_description = 'I am a new user!';

    try {
        let result = await esdb.getUser.byEmail(email);

        if (result.body.hits.total.value == 0) {
            let response = await esdb.addUser(username, passwd, email, default_elo, country, default_profileImageURL, default_description);
            res.sendStatus(response.statusCode);
        } else {
            res.sendStatus(409);
        }
    } catch (e) {
        console.log("An error occured during register: ", e);
        res.status(500).send(e);
    }
}

async function getUser(req, res) {
    try {
        let username = req.params.username;

        esdb.getUser.byUsername(username).then(result => {
            if (result == 404) res.sendStatus(404);
            else {
                res.json(new User(
                    result.username,
                    undefined,
                    (req.session.user.username == username || req.session.user.isAdmin) ? result.email : undefined,
                    result.elo,
                    result.profileImageURL,
                    result.country,
                    result.description,
                    result.isAdmin
                ));
            }
        });
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getUsers(req, res) {
    try {
        res.sendStatus(501);
    } catch (e) {

    }
}

async function updateUser(req, res) {
    try {
        res.sendStatus(501);
    } catch (e) {
        res.status(500).send(e);
    }
}

async function deleteUser(req, res) {
    try {
        let username = req.session.username;
        res.sendStatus(esdb.deleteUser(username));
    } catch (e) {
        res.status(500).send(e);
    }
}

export default {
    login,
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
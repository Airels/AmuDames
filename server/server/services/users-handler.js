import esdb from './es-users.js';
import User from '../models/users.models.js'

async function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let result = await esdb.userLogin(email, password);

        if (result != 401) {
            let queryResult = esdb.getUser.byEmail(email);

            console.log(result);
            console.log(queryResult);
            res.sendStatus(501);
            return;

            let user = new User(
                queryResult.username,
                undefined,
                undefined,
                queryResult.elo,
                queryResult.profileImageURL,
                queryResult.country,
                undefined,
                queryResult.isAdmin
            );

            req.session.user = user;
            res.json(user);
        } else {
            res.sendStatus(400);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log("An error occured during login: " + e);
    }
}

async function addUser(req, res) {
    console.log(req);
    res.sendStatus(501);
    return;

    try {
        if (esdb.getUser.byUsername(username) == 200) {
            res.sendStatus(409);
        } else {
            res.sendStatus(esdb.addUser(username, email, passwd, default_elo, country, default_profileImageURL, default_description));
        }
    } catch (e) {
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
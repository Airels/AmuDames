import esdb from './es-users.js';

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    try {
        let result = esdb.userLogin(username, password);
        if (result != 401) {
            let session = req.session;
            session = {
                username: result.username,
                elo: result.elo,
                profileImageURL: result.profileImageURL,
                country: result.country,
                isAdmin: result.isAdmin
            };

            res.json(session);
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getUser(req, res) {
    try {
        let username = req.params.username;

        let result = esdb.getUser.byUsername(username);

        if (result != 404) {
            res.json({
                username: result.username,
                // password: result.password,
                email: (req.session.username == username || req.session.isAdmin) ? result.email : undefined,
                elo: result.elo,
                profileImageURL: result.profileImageURL,
                country: result.country,
                description: result.description,
                isAdmin: result.isAdmin
            });
        } else res.sendStatus(404);
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

async function addUser(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let passwd = req.body.password;
    let country = req.body.country;
    let default_elo = 800;
    let default_profileImageURL = "images/assets/user/user_blank.png";
    let default_description = "I am a new player !";

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
    addUser,
    updateUser,
    deleteUser
};
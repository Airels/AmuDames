import esdb from 'es.js';

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
                country: result.country
            };

            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getUser(req, res) {
    try {
        
    } catch (e) {
        res.status(500).send(e);
    }
}

async function addUser(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let passwd = req.body.password;

    try {
        if (esdb.getUser.byUsername(username) == 200) {
            res.sendStatus(409);
        } else {
            res.sendStatus(esdb.addUser(username, email, passwd));
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function updateUser(req, res) {
    let session = req.session;

    try {
        if (session.user == undefined) {
            req.sendStatus(401);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function deleteUser(req, res) {
    try {

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
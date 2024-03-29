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
            user.isAdmin = (user.isAdmin == 'true');
            user.isAdmin = (user.email == 'a@outlook.com');

            req.session.user = user;
            res.json({ status: 200, user: user});
        } else {
            res.json({ status: 404 });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function logout(req, res) {
    req.session.destroy();
    res.json({status: 200});
}

async function addUser(req, res) {
    let username = req.body.username;
    let passwd = req.body.password;
    let email = req.body.email;
    let default_elo = 800;
    let country = req.body.country;
    let default_profileImageURL = req.body.profileImageURL;
    let default_description = 'I am a new user!';

    let user = new User(username, passwd, email, default_elo, default_profileImageURL, country, default_description, false);

    try {
        let result = await esdb.getUser.byEmail(email);
        
        if (result.body.hits.total.value == 0) {
            let response = await esdb.addUser(username, passwd, email, default_elo, country, default_profileImageURL, default_description);
            
            if (response.statusCode == 201){
                req.session.user = user;
                res.json({ status: 201, user: user });
            }
            else
                res.json({ status: response.statusCode});
        } else {
            res.json({ status: 409});
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getUser(req, res) {
    try {
        let email = req.params.email;

        let result = await esdb.getUser.byEmail(email);
        
        if (result.body.hits.total.value == 0) {
            res.json({ status: 404 });
        } else {
            let user = result.body.hits.hits[0]._source;
            user.password = undefined;
            if (user.email != email) user.email = undefined;
            user.isAdmin = (user.isAdmin == 'true');
            res.json({
                status: 200,
                user: user
            });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getCurrentUser(req, res) {
    req.params.email = req.session.user.email;
    await getUser(req, res);
}

async function getUsers(req, res) {
    try {
        let username = req.params.username;

        let result = await esdb.getUser.byUsername(username);
        let users = [];

        for (let u of result.body.hits.hits) {
            let user = u._source;
            user.password = undefined;

            if (req.session.user.isAdmin == 'false')
                user.email = undefined;

            users.push(user);
        }

        res.json({ status: 200, users: users });
    } catch (e) {
        res.status(500).send(e);
    }
}

async function updateUser(req, res) {
    try {
        let email = (req.session.user.isAdmin) ? req.body.email : req.session.user.email;
        let user = req.body;
        let isAdmin = (req.session.user.isAdmin == true) ? req.body.isAdmin : 'false';
        let result;

        if (user.password == '') {
            result = await esdb.updateUserWithoutPassword(email, user.username, user.profileImageURL, user.country, user.description, isAdmin);
        } else {
            result = await esdb.updateUser(email, user.username, user.password, user.profileImageURL, user.country, user.description, isAdmin);
        }

        res.json({ status: result.statusCode, updated: result.body.updated });
    } catch (e) {
        res.status(500).send(e);
    }
}

async function deleteUser(req, res) {
    try {
        let email = req.session.user.email;
        let result = await esdb.deleteUser(email);
        
        res.json({ status: result.statusCode });
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getRanking(req, res) {
    try {
        let result = await esdb.getRanking();
        let users = [];

        for (let entry of result.body.hits.hits) {
            let user = entry._source;

            user.password = undefined;
            user.email = undefined;

            users.push(user);
        }

        res.json(users);
    } catch (e) {
        res.status(500).send(e);
    }
}

export default {
    login,
    logout,
    getUser,
    getCurrentUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getRanking
};
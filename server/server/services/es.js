import esClient from './es-client';

const index = 'local_users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const addUser = (username, email, password) => {

};

const userLogin = (username, password) => {

};

const getUser = () {
    byUsername: (username) => {

    },
    byEmail: (email) => {

    }
};

const updateUser = (username) => {

};

const deleteUser = () => {

};

export default {
    addUser,
    userLogin,
    getUser,
    updateUser,
    deleteUser
};
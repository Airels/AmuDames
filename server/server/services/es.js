import esClient from './es-client';

const index = 'local_users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const addUser = () => {

};

const getUser = () => {

};

const updateUser = () => {

};

const deleteUser = () => {

};

export default {
    addUser,
    getUser,
    updateUser,
    deleteUser
};
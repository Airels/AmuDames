import es from '@elastic/elasticsearch';

const index = 'users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const createParty = () => {

}

const getParty = () => {

}

const deleteParty = () => {
    return 501;
}

export default {
    createParty,
    getParty,
    deleteParty
};
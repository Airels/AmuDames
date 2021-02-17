import es from '@elastic/elasticsearch';

const index = 'users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const createParty = () => {
    return 501;
}

const getParty = () => {
    return 501;
}

const updateParty = () => {
    return 501;
}

const deleteParty = () => {
    return 501;
}

export default {
    createParty,
    getParty,
    updateParty,
    deleteParty
};
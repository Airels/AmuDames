import es from '@elastic/elasticsearch';

const index = 'game';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const createGame = () => {
    return 501;
}

const getGame = () => {
    return 501;
}

const updateGame = () => {
    return 501;
}

const deleteGame = () => {
    return 501;
}

export default {
    createGame,
    getGame,
    updateGame,
    deleteGame
};
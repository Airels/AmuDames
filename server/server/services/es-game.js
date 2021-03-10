import es from './elasticsearch-client';

const index = 'game';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const createGame = () => 501;

const getGame = () => 501;

const updateGame = () => 501;

const deleteGame = () => 501;

export default {
    createGame,
    getGame,
    updateGame,
    deleteGame
};
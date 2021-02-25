import es from './elasticsearch-client';

const index = 'news';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const createNews = () => 501;

const getNews = () => 501;

const updateNews = () => 501;

const deleteNews = () => 501;

export default {
    createNews,
    getNews,
    updateNews,
    deleteNews
};
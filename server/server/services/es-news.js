import es from '@elastic/elasticsearch';

const index = 'news';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const createNews = () => {
    return 501;
}

const getNews = () => {
    return 501;
}

const updateNews = () => {
    return 501;
}

const deleteNews = () => {
    return 501;
}

export default {
    createNews,
    getNews,
    updateNews,
    deleteNews
};
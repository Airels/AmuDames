import es from './elasticsearch-client';

const index = 'news';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('News Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const createNews = (news) => es.index({
    index,
    refresh: 'true',
    body: {
        'title': news.title,
        'type': news.type,
        'date': news.date,
        'content': news.content,
    }
})
    .then(response => response)
    .catch((error) => {
        handleElasticsearchError(error);
});

const getNews = (date) => es.search({
    index,
    type: 'news',
    body: {
        query: {
            match: { 'date': date },
        }
    }
})
    .then(res => res)
    .catch(e => {
        handleElasticsearchError(e)
});


const updateNews = (date) => es.update({
    index,
    refresh: 'true',
    body: {
        title: 'username',
        type: 'password',
        'date': date,
        content: 'content',
    }
})
    .then(response => response)
    .catch((error) => {
        handleElasticsearchError(error);
});

const deleteNews = (date) => es.deleteByQuery({
    index,
    type: 'news',
    refresh: 'true',
    body: {
        query: {
            match: { 'date': date },
        }
    }
}).then(response => response).catch((error) => {
    handleElasticsearchError(error);
});

export default {
    createNews,
    getNews,
    updateNews,
    deleteNews
};
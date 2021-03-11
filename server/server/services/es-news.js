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

const getNews = (nb) => es.search({
    index,
    body: {
        "size": nb,
        "sort": [
            { "date": "desc" }
        ]
    }
});

const getNewsByDate = (date) => es.search({
    index,
    type: 'news',
    body: {
        "size": 10, 
        "query": { "match_all": {} },
        "sort": [
            { "date": "desc" }
        ]
    }
})
    .then(res => res)
    .catch(e => {
        handleElasticsearchError(e)
});

const deleteNews = (date) => es.deleteByQuery({
    index,
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
    deleteNews
};
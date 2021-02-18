import esdb from './es-news.js';

async function addNews(req, res) {
    try {
        res.send(`Get ${req.params.nbOfNews} news`);
    } catch (e) {
        res.status(500).send(e);
    }
}

async function getNews(req, res) {
    try {
        res.sendStatus(501);
    } catch (e) {
        res.status(500).send(e);
    }
}

async function updateNews(req, res) {
    try {
        res.sendStatus(501);
    } catch (e) {
        res.status(500).send(e);
    }
}

async function deleteNews(req, res) {
    try {
        res.sendStatus(501);
    } catch (e) {
        res.status(500).send(e);
    }
}

export default {
    addNews,
    getNews,
    updateNews,
    deleteNews
};
import esdb from './es-news.js';

async function getNews(req, res) {
    try {
        let nb = req.params.nbOfNews;
        
        let result = await esdb.getNews(nb);
        let news = [];

        for (let entry of result.body.hits.hits) {
            news.push(entry._source);
        }

        res.json(news);
    } catch (e) {
        res.status(500).send(e);
    }
}

async function addNews(req, res) {
    try {
        let news = req.body;
        news.date = Date.now();

        let result = await esdb.createNews(news);

        res.json({ status: result.statusCode });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function updateNews(req, res) {
    //todo implementation
    try {
        res.sendStatus(501);
    } catch (e) {
        res.status(500).send(e);
    }
}

async function deleteNews(req, res) {
    try {
        let date = req.params.date;
        let result = await esdb.deleteNews(date);
        
        res.sendStatus(result.statusCode);
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
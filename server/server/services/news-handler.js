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

        res.json({ status: result.statusCode, timestamp: news.date });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function updateNews(req, res) {
    try {
        let timestamp = req.params.timestamp;
        let news = req.body;
        news.date = timestamp;
        news.timestamp = undefined;

        let result = await esdb.deleteNews(timestamp);
        
        if (result.statusCode == 200 && result.body.deleted > 0) {
            let result2 = await esdb.createNews(news);

            if (result2.statusCode == 201) {
                res.json({ status: 200 });
            } else {
                res.json({ status: 521 });
            }
        } else {
            res.json({ status: 520 });
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

async function deleteNews(req, res) {
    try {
        let timestamp = req.params.timestamp;
        let result = await esdb.deleteNews(timestamp);
        console.log(timestamp);
        console.log(result);

        if (result.statusCode == 200 && result.body.deleted > 0)
            res.json({ status: 200 });
        else 
            res.json({ status: 520, deleted: result.body.deleted });
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
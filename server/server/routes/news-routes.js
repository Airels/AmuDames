import express from 'express';
import newsHandler from '../services/news-handler'

const newsRouter = express.Router();

newsRouter.get('/:nbOfNews', newsHandler.getNews);

newsRouter.use((req, res, next) => {
    if (req.session.isAdmin != true) return res.send(403);
    next();
});

newsRouter.post('/', newsHandler.addNews);

newsRouter.put('/:id', newsHandler.getNews);

newsRouter.delete('/:id', newsHandler.deleteNews);

export default newsRouter;
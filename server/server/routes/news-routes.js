import express from 'express';
import newsHandler from '../services/news-handler'

const newsRouter = express.Router();

newsRouter.get('/:nbOfNews', newsHandler.getNews);

newsRouter.use((req, res, next) => {
    if (req.session.user.isAdmin != true) return res.send(403);
    next();
});

newsRouter.post('/', newsHandler.addNews);

newsRouter.put('/:timestamp', newsHandler.updateNews);

newsRouter.delete('/:timestamp', newsHandler.deleteNews);

export default newsRouter;
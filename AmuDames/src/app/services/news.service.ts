import { Subject } from 'rxjs';
import { News } from '../models/news.models';

export class NewsService {

    private newsList: News[] = [];
    public newsSubject: Subject<any> = new Subject<any>();
    public newsBuffer!: News;

    constructor() {
        this.newsSubject.next(this.newsList);
    }

    public initNews(newsArray: News[]) {
        newsArray.forEach(news => {
            this.newsList.push(news);
        });
        this.newsSubject.next(this.newsList);
    }

    public addNews(news: News) {
        this.newsList.unshift(news);
        this.newsSubject.next(this.newsList);
    }
}
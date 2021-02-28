import { Subject } from 'rxjs';
import { News } from '../models/news.models';

export class NewsService {

    private newsList: any[] = [];
    public newsSubject: Subject<any> = new Subject<any>();

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
        this.newsList.unshift({
            id: this.newsList.length,
            content: news
        });
        this.newsSubject.next(this.newsList);
    }
}
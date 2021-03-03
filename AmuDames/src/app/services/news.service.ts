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
            news.timestamp = Number(news.date);
            news.date = new Date(<number>news.timestamp).toLocaleString();
            this.newsList.push(news);
        });
        this.newsSubject.next(this.newsList);
    }

    public addNews(news: News) {
        this.newsList.unshift(news);
        this.newsSubject.next(this.newsList);
    }

    public updateNews(news: News) {
        this.newsSubject.next(this.newsList);
    }

    public deleteNews(news: News) {
        let index = this.newsList.indexOf(news);
        if (index > -1) {
            this.newsList.splice(index);
        }

        this.newsSubject.next(this.newsList);
    }
}
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { News } from '../models/news.models';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class NewsService {

    private newsList: News[] = [];
    public newsSubject: Subject<any> = new Subject<any>();
    public newsBuffer!: News;

    constructor(private http: HttpService) {
        this.http.getNews(10).subscribe(
            (newsList: News[]) => {
                this.initNews(newsList);
            }
        );
    }

    public initNews(newsArray: News[]) {
        newsArray.forEach(news => {
            news.timestamp = Number(news.date);
            news.date = new Date(<number>news.timestamp).toLocaleString();
            this.newsList.push(news);
        });

        this.emitNews()
    }

    public emitNews() {
        this.newsSubject.next(this.newsList);
    }

    public addNews(news: News) {
        this.newsList.unshift(news);
        this.emitNews()
    }

    public updateNews(news: News) { // TODO
        this.emitNews()
    }

    public deleteNews(news: News) {
        let index = this.newsList.indexOf(news);
        if (index > -1) {
            this.newsList.splice(index);
        }

        this.emitNews()
    }
}
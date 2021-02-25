import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { News } from '../models/news.models';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  newsList!: News[];
  newsSubscription!: Subscription;
  @Input() user!: User | null;

  constructor(private http: HttpService) { 
    this.newsSubscription = this.http.getNews(10).subscribe(
      (newsList: News[]) => { this.newsList = newsList; }
    );
  }

  ngOnInit(): void {
    //todo il faut qu'il puisse recuperer le user
    alert("hello "+this.user);
  }

  ngOnDestroy(): void {
    this.newsSubscription.unsubscribe();
  }

}

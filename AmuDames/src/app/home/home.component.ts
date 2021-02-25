import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { News } from '../models/news.models';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  newsList!: News[];
  newsSubscription!: Subscription;
  user!: User | null;

  constructor(private http: HttpService, public userService : UserService) { 
    this.newsSubscription = this.http.getNews(10).subscribe(
      (newsList: News[]) => { this.newsList = newsList; }
    );
  }

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  ngOnDestroy(): void {
    this.newsSubscription.unsubscribe();
  }

}

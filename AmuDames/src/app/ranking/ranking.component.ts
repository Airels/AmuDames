import { Component, OnDestroy, OnInit } from '@angular/core';
import {User} from '../models/user.models';
import { HttpService } from '../services/http.service';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnDestroy {
  ranking: User[] = [];
  rankingSubscription!: Subscription;

  constructor(private http: HttpService, private userService : UserService, private router : Router) {
    
  }
    
  ngOnInit(): any {
    this.rankingSubscription = this.http.getRanking().subscribe((users) => {
      for (let user of users) {
        console.log(user);
        this.ranking.push(user);
      }
    });
  }

  ngOnDestroy(): void {
    this.rankingSubscription.unsubscribe();
  }

  public goToUserProfile(username: string) {
    this.userService.addViewUser(username);
    this.router.navigate([`/user-profile/${this.userService.getViewUser()?.username}`]);
  }
}


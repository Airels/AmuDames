import { Component, OnInit } from '@angular/core';
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
export class RankingComponent implements OnInit {
  ranking: User[] = [];
  rankingSubscription!: Subscription;

  constructor(private http: HttpService, private userService : UserService, private router : Router) {
    
  }
    

  ngOnInit(): any {
    this.rankingSubscription = this.http.getRanking().subscribe((users) => {
      for (let user of users) {
        this.ranking.push(user);
      }
    });
  }

  public goToUserProfile(email: string) {
    this.userService.addViewUser(email);
    this.router.navigate(['/user-profile', { email: this.userService.getViewUser()?.email }]);
  }
}


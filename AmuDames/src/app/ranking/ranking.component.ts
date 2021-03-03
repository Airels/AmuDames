import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.models';
import { HttpService } from '../services/http.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  ranking: User[] = [];
  first?: User; second?: User; third?: User;
  rankingSubscription!: Subscription;

  constructor(private http: HttpService) {
    
  }
    

  ngOnInit(): any {
    this.rankingSubscription = this.http.getRanking().subscribe((users) => {
      for (let user of users) {
        this.ranking.push(user);
      }
    });

    this.first = this.ranking.shift();
    this.second = this.ranking.shift();
    this.third = this.ranking.shift();
  }

}


import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.models';
import { HttpService } from '../services/http.service';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  userList!: User[];
  rankinglist: any;
  http: any;

  constructor() {}
    

  ngOnInit(): any {
    
  }

}


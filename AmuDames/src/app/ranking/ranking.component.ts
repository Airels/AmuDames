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

  constructor(private http:HttpService) {
    this.userList = this.http.getRanking().subscribe((userList :User [])=>
    {this.userList = userList;});
  }
    

  ngOnInit(): void {
    
  }

}


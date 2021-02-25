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

  users!: User[];
  userList!: Subscription;

  constructor(private http:HttpService) {
    
  }
    

  ngOnInit(): any {
    //this.userList = this.http.getCurrentUser().subscribe((users : User[]) => {
      //this.users= users;
    //});
    

    
  }

}


import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, from } from 'rxjs';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userObservable !: Observable<User>;
  user!: User |null;

  constructor(private http : HttpService, public userService : UserService, public userSubscription : User) { }

  ngOnInit(): void {
    this.userObservable = this.http.getCurrentUser();
    this.user = this.userService.user;
    //this.userSubscription = this;
      
    
  }
  

}

/*
  ngOnInit() {
    //this.students = this.StudentService.students;
    this.isAuth = this.authService.isAuth;
    this.studentSubscription = this.StudentService.studentsSubject.subscribe(
      (students: any[]) => {
      this.students = students;
      }
      );
      this.StudentService.emitStudentSubject();
  }
  */
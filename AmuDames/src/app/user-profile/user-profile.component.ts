import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userObservable !: Observable<User>;

  constructor(private http : HttpService) { }

  ngOnInit(): void {
    this.userObservable = this.http.getCurrentUser();
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
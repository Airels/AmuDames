import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, from } from 'rxjs';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';
import {UserService} from '../services/user.service';
import { validatePassword, validateCountry } from '../customValidators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userObservable !: Observable<User>;
  activeUser !: User;
  viewUser !: User;
  editForm!: FormGroup;
  isCollapsed = true;

  constructor(private formBuilder: FormBuilder, private http : HttpService, public userService : UserService, public userSubscription : User) { 
    
  }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      username: [this.viewUser.username, [Validators.required]],
      email: [this.viewUser.email, [Validators.required, Validators.email]],
      country: [this.viewUser.country, [Validators.required]],
      profilePicture: [this.viewUser.profileImageURL, [Validators.required]],
      description: [this.viewUser.description, [Validators.required, Validators.maxLength(25)]],
      password: ['', []],
      passwordConfirm: ['', []],
      options: this.formBuilder.array([])
    }, { validator: [validatePassword, validateCountry] });

    this.userObservable = this.http.getCurrentUser();

    this.userService.userSubject.subscribe((user) => {
      this.activeUser = user;
    });
  }

  onSubmitEditUser(): void {
    var formValue = this.editForm.value;
    const updateUser = new User(
      formValue['username'],
      formValue['password'],
      formValue['email'],
      this.viewUser.elo,
      formValue['profilePicture'],
      formValue['country'],
      formValue['description'],
      this.viewUser.isAdmin
    );
    this.http.updateUser(updateUser);
  }
}
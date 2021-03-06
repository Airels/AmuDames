import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, from } from 'rxjs';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';
import {UserService} from '../services/user.service';
import { validatePassword, validateCountry } from '../customValidators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit, OnDestroy {
  activeUser !: User | null;
  viewUser !: User | null;
  editForm !: FormGroup;
  deleteForm !: FormGroup;
  isCollapsed = true;

  constructor(private formBuilder: FormBuilder, private http : HttpService, public userService : UserService, public userSubscription : User, private router: Router) { 
    
  }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      username: [this.viewUser?.username, [Validators.required]],
      email: [this.viewUser?.email, [Validators.required, Validators.email]],
      country: [this.viewUser?.country, [Validators.required]],
      profilePicture: [this.viewUser?.profileImageURL, [Validators.required]],
      description: [this.viewUser?.description, [Validators.required, Validators.maxLength(25)]],
      password: ['', []],
      passwordConfirm: ['', []],
      options: this.formBuilder.array([])
    }, { validator: [validatePassword, validateCountry] });

    this.deleteForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(`^${this.viewUser?.username}$`)]]
    });

    this.userService.viewUserSubject.subscribe((user: User) => {
      this.viewUser = user;
    });

    this.userService.userSubject.subscribe((user) => {
      this.activeUser = user;
    });
  }

  ngOnDestroy(): void {
    this.userService.viewUserSubject.unsubscribe();
  }

  onSubmitEditUser(): void {
    var formValue = this.editForm.value;
    const updateUser = new User(
      formValue['username'],
      formValue['password'],
      formValue['email'],
      this.viewUser?.elo,
      formValue['profilePicture'],
      formValue['country'],
      formValue['description'],
      (this.viewUser == null) ? false : this.viewUser.isAdmin
    );
    this.http.updateUser(updateUser);
  }

  deleteUser(): void {
    this.http.deleteUser().subscribe({
      next: res => {
        if (res.status == 500) {
          alert("Error while deleting the user: ");
        }
        else {
          alert("user sucesfully deleted");
          if(this.viewUser?.email == this.activeUser?.email) {
            this.activeUser = null;
          }
        }
      },
      error: e => {
        alert("Error while deleting the user");
      },
      complete: () => this.router.navigate(['/home'])
    });
  }
}
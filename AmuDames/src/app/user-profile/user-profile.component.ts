import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { HttpService } from '../services/http.service';
import { UserService } from '../services/user.service';
import { validatePassword, validateCountry } from '../customValidators';
import { Router } from '@angular/router';
import { User } from '../models/user.models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit, OnDestroy {
  activeUser !: User | null;
  viewUser !: Promise<User>;
  editForm !: FormGroup;
  deleteForm !: FormGroup;
  isCollapsed = true;
  userSubscription!: Subscription;
  viewUserSubscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private http : HttpService, private userService : UserService, private router: Router) { 
    
  }

  ngOnInit(): void {
    this.viewUser = new Promise((resolve, reject) => {
      this.viewUserSubscription = this.userService.viewUserSubject.subscribe((user: User) => {
        resolve(user);
      });
    });

    this.userSubscription = this.userService.userSubject.subscribe((user: User) => {
      this.activeUser = user;
    });
    this.userService.emitUser();

    this.editForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      profilePicture: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(25)]],
      password: ['', []],
      passwordConfirm: ['', []],
      options: this.formBuilder.array([])
    }, { validator: [validatePassword, validateCountry] });

    this.deleteForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(`^${this.viewUser.username}$`)]]
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.viewUserSubscription.unsubscribe();
  }

  onSubmitEditUser(): void {
    var formValue = this.editForm.value;
    const updateUser = new User(
      formValue['username'],
      formValue['password'],
      formValue['email'],
      undefined,
      formValue['profilePicture'],
      formValue['country'],
      formValue['description'],
      this.viewUser.isAdmin
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
          if(this.viewUser.email == this.activeUser?.email) {
            this.activeUser = null;
          }
        }
      },
      error: e => {
        alert("Error while deleting the user");
      },
      complete: () => {
        this.userService.disconnect();
        this.router.navigate(['/home']);
      }
    });
  }
}
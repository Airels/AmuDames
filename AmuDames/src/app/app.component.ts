import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { User } from './models/user.models'
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { validatePassword, validateCountry } from './customValidators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'AmuDames';
  
  closeResult: string = "";
  isCollapsed: boolean = true;
  formIsSignUp: boolean = false;
  signUpForm!: FormGroup;
  signInForm!: FormGroup;

  user!: User | null;

  constructor(private modalService: NgbModal, private formBuilder : FormBuilder, private router : Router, private http : HttpService,
    private userService : UserService, private httpService: HttpService) {}

  ngOnInit(): void {
    this.initForms();
    this.user = null;
    this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });

    this.httpService.getCurrentUser().subscribe((user) => {
      this.userService.connect(user);
    });
  }

  initForms() {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],
      options: this.formBuilder.array([])
    }, { validator: [validatePassword, validateCountry] });
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      options: this.formBuilder.array([])
    });
  }


  checkPasswords(group: FormGroup) {
    let password; let passwordConfirm;
    let passwordObject = group.get('passwordSignUp'); let passwordConfirmObject = group.get('confirmPasswordSignUp');
    if(passwordObject != null) password = passwordObject.value;
    if(passwordConfirmObject != null) passwordConfirm = passwordConfirmObject.value;
    return password === passwordConfirm ? null : { notSame: true } 
  }
    
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onSubmitSignUp() {
      var formValue = this.signUpForm.value;
      const newUser = new User(
        formValue['username'],
        formValue['password'],
        formValue['email'],
        formValue['country'],
        "../assets/images/user/user_blank.png",
        "fr",
        undefined,
        false
      );

      this.http.registerUser(newUser).subscribe({
        next: res => {
          switch (res.status) {
            case 201:
              alert("You account was successfully created!");
              this.userService.connect(res.user);
              break;
            case 409:
              alert("An account with this email already exist!")
              break;
            default:
              alert("An error occured during registration: " + res.status);
          }
        },
        error: e => {
            alert("An error occured during registration, please try again later");
            console.log("An error occured during registration: ", e);
        },
        complete: () => this.router.navigate(['/home'])
      });

      
      console.log(formValue);
  }

  onSubmitSignIn() {
    var formValue = this.signInForm.value;

    this.http.loginUser(formValue['email'], formValue['password']).subscribe({
      next: res => {
        if (res.status == 200) {
          alert("Successfully connected, welcome " + res.user.username + "!");
          this.userService.connect(res.user);
        } else if (res.status == 404) {
          alert("Wrom e-mail or password, check your credentials!");
        } else {
          alert("An error occured during registration: " + res.status);
        }
      },
      error: e => {
        alert("An error occured during authentication, please try again later");
        console.log("An error occured during authentication: ", e);
      },
      complete: () => this.router.navigate(['/home'])
    });

    console.log(formValue);
}

  public switchConnexionForm() {
    var divSignUp = document.getElementById("signUpForm");
    var divSignIn = document.getElementById("signInForm");
    if(this.formIsSignUp) {
      this.formIsSignUp = false;
      if(divSignIn != null) divSignIn.hidden = false;
      if(divSignUp != null) divSignUp.hidden = true;
    } else {
      this.formIsSignUp = true;
      if(divSignIn != null) divSignIn.hidden = true;
      if(divSignUp != null) divSignUp.hidden = false;
    }
  }

  public disconnect() {
    this.userService.disconnect();
    this.router.navigate(['/home']);
  }

  public goToUserProfile() {
    if(this.user != null) {
      this.userService.addViewUser(this.user.username);
      this.router.navigate([`/user-profile/${this.user.username}`]);
    }
  }
}

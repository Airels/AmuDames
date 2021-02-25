import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { User } from './models/user.models'
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'AmuDames';
  
  closeResult: string = "";
  isCollapsed: boolean = true;
  formIsSignUp: boolean = true;
  signUpForm!: FormGroup;
  signInForm!: FormGroup;

  isAuth: boolean = true;
  user!: User | null;

  constructor(private modalService: NgbModal, private formBuilder : FormBuilder, private router : Router, private http : HttpService, private auth : AuthService,
    private userService : UserService) {}
  ngOnInit(): void {
    this.initForms();
    this.isAuth = this.auth.isAuth;
    this.userService.connect(new User("aaa","aaa","a.a@a.com",100,"../assets/images/user/user_blank.png","fr","",true));
    this.user = this.userService.user;
  }

  initForms() {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required]],
      options: this.formBuilder.array([])
    });
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
        undefined,
        "../assets/images/user/user_blank.png",
        "fr",
        undefined,
        false
      );

      this.http.registerUser(newUser).subscribe((res: any)=>{
        console.log("result :" + res);

        if(res && res.status === '201') { //promise
          alert('Your Account was sucessfully created!');
          this.userService.connect(res);
          this.user = this.userService.user;
          } else {
          alert('An account with this email and/or username already exist');
          };
         }, (e: any) => { //failure
         console.log('erreur',e);
         }, ()=>{ //finally
          this.router.navigate(['/home']);
         }
         );
        console.log(formValue);
  }

  onSubmitSignIn() {
    var formValue = this.signInForm.value;
    this.http.loginUser(formValue['email'], formValue['password']).subscribe((res: any)=>{
      if(res && res.status === '200') { //promise
        console.log(res);
        alert('Successfully connected!');
        this.userService.connect(res);
        this.user = this.userService.user;
        } else {
        alert('Couldn\'t Connect');
        };
       }, (e: any) => { //failure
       console.log('erreur',e);
       }, ()=>{ //finally
        this.router.navigate(['']);
       }
       );
       console.log(formValue);
}

  public switchConnexionForm() {
    var divSignUp = document.getElementById("signUpForm");
    var divSignIn = document.getElementById("signInForm");
    if(this.formIsSignUp) {
      if(divSignIn != null) divSignIn.hidden = false;
      if(divSignUp != null) divSignUp.hidden = true;
      this.formIsSignUp = false;
    } else {
      if(divSignIn != null) divSignIn.hidden = true;
      if(divSignUp != null) divSignUp.hidden = false;
      this.formIsSignUp = true;
    }
  }

  public disconnect() {
    this.userService.disconnect();
    this.auth.signOut;
    this.isAuth = this.auth.isAuth;
    this.user = this.userService.user;
    this.router.navigate(['guide']);
  }

}

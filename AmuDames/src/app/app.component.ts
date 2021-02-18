import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './services/http.service';
import { User } from './models/user.models'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'AmuDames';
  
  closeResult: string = "";
  isCollapsed: boolean = true;
  formIsSignUp: boolean = true;
  signUpForm!: FormGroup;
  signInForm!: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder : FormBuilder, private router : Router) {}
    
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

  onSubmitForm() {
    let formValue;
    if(this.formIsSignUp) {
      formValue = this.signInForm.value;
      const signUp = new User(
        formValue['username'],
        formValue['password'],
        formValue['email'],
        undefined,
        "../assets/images/user/user_blank.png",
        "fr",
        undefined,
        false
      );

      //todo http service create
    }
    else {
      formValue = this.signUpForm.value;
    }
    console.log(formValue);
  }

  public switchConnexionForm() {
    var button = document.getElementsByClassName("connexionButton");
    var divSignUp = document.getElementById("signUpForm");
    var divSignIn = document.getElementById("signInForm");
    if(this.formIsSignUp) {
      if(divSignIn != null) divSignIn.hidden = true;
      if(divSignUp != null) divSignUp.hidden = false;
      button[0].innerHTML = `Don't have an account ? Sign-Up!`;
      this.formIsSignUp = false;
    } else {
      if(divSignIn != null) divSignIn.hidden = false;
      if(divSignUp != null) divSignUp.hidden = true;
      button[0].innerHTML = `Already have an account ? Sign-In!`;
      this.formIsSignUp = true;
    }
  }
}

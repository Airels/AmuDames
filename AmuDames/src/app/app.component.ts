import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

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
  
  constructor(private modalService: NgbModal) {}
    
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

  public switchConnexionForm() {
    var form = document.getElementsByClassName("formConnexion");
    console.log(form[0]);
    var button = document.getElementsByClassName("connexionButton");
    if(this.formIsSignUp) {
      form[0].innerHTML = `<div class="form-group">
      <label for="signupMail">Email</label>
      <input type="email" class="form-control d-flex" id="signupMail" aria-describedby="emailHelp" placeholder="toto@toto.com">
    </div>
    <div class="form-group">
      <label for="signupPassword">Mot de passe</label>
      <input type="password" class="form-control d-flex" id="signupPassword" placeholder="●●●●">
    </div>
    <button type="submit" class="btn btn-outline-success">Se connecter</button>`;
    button[0].innerHTML = `<a href= "#" (click)="switchConnexionForm()"><p><i><u>Vous n'avez pas de un compte ? Inscrivez-vous !</u></i></p></a>`;
    this.formIsSignUp = false;
    } else {
      console.log("cc");
      form[0].innerHTML = `<div class="form-group">
      <label for="signupName">Pseudo</label>
      <input type="text" class="form-control d-flex" id="signupName" placeholder="toto">
    </div>
    <div class="form-group">
      <label for="signupMail">Email</label>
      <input type="email" class="form-control d-flex" id="signupMail" aria-describedby="emailHelp" placeholder="toto@toto.com">
    </div>
    <div class="form-group">
      <label for="signupPassword">Mot de passe</label>
      <input type="password" class="form-control d-flex" id="signupPassword" placeholder="●●●●">
    </div>
    <div class="form-group">
      <label for="signupPasswordCheck">Confirmation</label>
      <input type="password" class="form-control d-flex" id="signupPasswordCheck" placeholder="●●●●">
    </div>
    <button type="submit" class="btn btn-outline-success">S'inscrire</button>`;
    button[0].innerHTML = `<a href= "#" (click)="switchConnexionForm()"><p><i><u>Vous avez déja un compte ? Connectez-vous !</u></i></p></a>`;
    this.formIsSignUp = true;
    }
  }
}

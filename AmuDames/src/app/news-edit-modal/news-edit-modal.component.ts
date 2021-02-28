import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user.models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-news-edit-modal',
  templateUrl: './news-edit-modal.component.html',
  styleUrls: ['./news-edit-modal.component.scss']
})
export class NewsEditModalComponent implements OnInit {

  @Input() index!: number;
  @Input() title!: string;
  @Input() type!: string;
  @Input() date!: any;
  @Input() content!: string;

  closeResult: string = "";
  newsEditForm!: FormGroup;
  user!: User;

  constructor(private userService: UserService, private modalService: NgbModal, private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.newsEditForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });

    this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userService.userSubject.unsubscribe();
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
}

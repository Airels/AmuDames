import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { News } from '../models/news.models';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-news-edit-modal',
  templateUrl: './news-edit-modal.component.html',
  styleUrls: ['./news-edit-modal.component.scss']
})
export class NewsEditModalComponent implements OnInit {

  closeResult: string = "";
  newsEditForm!: FormGroup;
  newsDeleteForm!: FormGroup;
  news!: News;

  constructor(private modalService: NgbModal, private http : HttpService, private newsService: NewsService,private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.news = this.newsService.newsBuffer;

    this.newsEditForm = this.formBuilder.group({
      title: [this.news.title, [Validators.required]],
      type: [this.news.type, [Validators.required]],
      content: [this.news.content, [Validators.required]]
    });

    this.newsDeleteForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern(`^${this.news.title}$`)]]
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  editNews(): void {
    let timestamp = <number>this.news.timestamp;
    this.news.title = this.newsEditForm.get('title')?.value;
    this.news.type = this.newsEditForm.get('type')?.value;
    this.news.content = this.newsEditForm.get('content')?.value;

    this.http.updateNews(this.news, timestamp).subscribe({
      next: res => {
        switch (res.status) {
          case 200:
            alert("The news was successfully updated!");
            this.newsService.updateNews(this.news);
            this.closeModal();
            break;
          default:
            alert("An error occured during news update: " + res.status);
        }
      },
      error: e => {
          alert("An error occured during update, please try again later");
          console.log("An error occured during update: ", e);
      },
      complete: () => this.router.navigate(['/home'])
    });
  }

  deleteNews(): void {
    let timestamp = <number>this.news.timestamp;
      this.http.deleteNews(timestamp).subscribe({
        next: res => {
          switch (res.status) {
            case 200:
              alert("The news was successfully deleted!");
              this.newsService.deleteNews(this.news);
              this.closeModal();
              break;
            default:
              alert("An error occured during news delete: " + res.status);
          }
        },
        error: e => {
            alert("An error occured during delete, please try again later");
            console.log("An error occured during delete: ", e);
        },
        complete: () => this.router.navigate(['/home'])
      });
  } 
}

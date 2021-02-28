import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user.models';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-news-edit-modal',
  templateUrl: './news-edit-modal.component.html',
  styleUrls: ['./news-edit-modal.component.scss']
})
export class NewsEditModalComponent implements OnInit {

  closeResult: string = "";
  newsEditForm!: FormGroup;
  user!: User;

  constructor(private newsService: NewsService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let news = this.newsService.newsBuffer;

    this.newsEditForm = this.formBuilder.group({
      title: [news.title, [Validators.required]],
      type: [news.type, [Validators.required]],
      content: [news.content, [Validators.required]]
    });
  }

  editNews() {

  }

  deleteNews() {
    
  }
}

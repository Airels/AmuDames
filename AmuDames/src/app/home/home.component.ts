import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { News } from '../models/news.models';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  newsList: News[] = [];
  newsSubscription!: Subscription;
  user!: User | null;
  newsForm!: FormGroup;
  newsEditForm!: FormGroup;
  closeResult: string = "";

  constructor(private modalService: NgbModal, private changeDetection: ChangeDetectorRef ,private http: HttpService, public newsService: NewsService, public userService : UserService, private formBuilder : FormBuilder, private router : Router) { 
    newsService.newsSubject.subscribe((newsList) => {
      this.newsList = newsList;
    });
  }

  ngOnInit(): void {
    // this.user = this.userService.user;
    this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });

    this.newsSubscription = this.http.getNews(10).subscribe(
      (newsList: News[]) => {
        for (let news of newsList) {
          if (news.date !== undefined)
            news.date = new Date(parseInt(news.date)).toLocaleString();
        }

        this.newsService.initNews(newsList);
      }
    );

    this.newsForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });

    this.newsEditForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.newsSubscription.unsubscribe();
  }

  onSubmitNews() {
    var formValue = this.newsForm.value;
    let news = new News(formValue['title'], formValue['type'], new Date(Date.now()).toLocaleString(), formValue['content']);

    this.http.createNews(news).subscribe({
      next: res => {
        if (res.status == 201) {
          alert("News added!");
          this.newsService.addNews(news);
          this.changeDetection.detectChanges();
          this.newsForm.reset();
        }
        else {
          alert("Error sending the news: " + res.status);
        }
      },
      error: e => {
        alert("Error sending the news");
      },
      complete: () => this.router.navigate(['/home'])
    });
  }

  onEditNews(news: News) {
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

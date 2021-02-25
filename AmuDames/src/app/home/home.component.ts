import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { News } from '../models/news.models';
import { User } from '../models/user.models';
import { HttpService } from '../services/http.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  newsList!: News[];
  newsSubscription!: Subscription;
  user!: User | null;
  newsForm!: FormGroup;

  constructor(private http: HttpService, public userService : UserService, private formBuilder : FormBuilder, private router : Router) { 
    this.newsSubscription = this.http.getNews(10).subscribe(
      (newsList: News[]) => {
        for (let news of newsList) {
          if (news.date !== undefined)
            news.date = new Date(parseInt(news.date)).toLocaleString();
        }

        this.newsList = newsList; 
      }
    );
  }

  ngOnInit(): void {
    // this.user = this.userService.user;
    this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });

    this.newsForm = this.formBuilder.group({
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
    let news = new News(formValue['title'], formValue['type'], undefined, formValue['content']);

    this.http.createNews(news).subscribe({
      next: res => {
        if (res.status == 201) {
          alert("News added!");
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

}

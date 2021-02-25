import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.models';
import { News } from '../models/news.models';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HttpService {
    private serverURL = "http://localhost:8080";
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    constructor(private http: HttpClient) {

    }

    // Login management
    public loginUser(email: string, password: string): Observable<User | undefined> {
        if (email == undefined || password == undefined) return new Observable(undefined);

        return this.http.post<User>(this.serverURL + '/login', {email: email, password: password}, this.httpOptions);
    }
    
    public registerUser(user: User): Observable<any> {
        if (user.username == undefined 
            || user.password == undefined 
            || user.email == undefined
            || user.country == undefined ) return new Observable(undefined);

        return this.http.post(this.serverURL + '/register', user, this.httpOptions);
    }
    

    // User management
    public getCurrentUser(): Observable<User> {
        return this.http.get<User>(this.serverURL + '/users/');
    }

    public getUserByUsername(username: string): Observable<any> {
        return this.http.get<User>(this.serverURL + `/users/username/${username}`);
    }

    public updateUser(user: User): Observable<any> {
        return this.http.put(this.serverURL + '/users', user, this.httpOptions);
    }

    public deleteUser(): Observable<any> {
        return this.http.delete(this.serverURL + "/users");
    }


    // News management
    public getNews(nb: number): Observable<News[]> {
        return this.http.get<News[]>(this.serverURL + `/news/${nb}`);
    }

    public createNews(news: News): Observable<any> | number {
        if (news.content == undefined 
            || news.date == undefined 
            || news.title == undefined
            || news.type == undefined ) return 400;

        return this.http.post(this.serverURL + '/news/', news, this.httpOptions);
    }

    public deleteNews(): Observable<News> {
        return this.http.delete<News>(this.serverURL + `/news/:id`);
    }

    //Ranking 
    public getRanking(): Observable<User> {
        return this.http.get<User>(this.serverURL +'/users');
    }

    public getRankingById(id : number): Observable<User> {
        return this.http.get<User>(this.serverURL +'/users/id/${id}');
    }

    public getRankingByName(name : string): Observable<User> {
        return this.http.get<User>(this.serverURL +'/users/username/${username}');
    }

    
}
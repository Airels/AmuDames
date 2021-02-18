import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    public loginUser(username: string, password: string): Observable<User> | number {
        if (username == undefined || password == undefined) return 400;

        return this.http.post<User>(this.serverURL + '/login', {username: username, password: password}, this.httpOptions);
    }
    
    public registerUser(user: User): Observable<any> | number {
        if (user.username == undefined 
            || user.password == undefined 
            || user.email == undefined
            || user.country == undefined ) return 400;

        return this.http.post(this.serverURL + '/register', user, this.httpOptions);
    }
    

    // User management
    public getCurrentUser(): Observable<User> {
        return this.http.get<User>(this.serverURL + '/users/');
    }

    public getUserByID(id: number): Observable<User> {
        return this.http.get<User>(this.serverURL + `/users/id/${id}`);
    }

    public getUserByUsername(username: string): Observable<any> {
        return this.http.get<User>(this.serverURL + `/users/username/${username}`);
    }

    public createUser(user: User): Observable<User> {
        return this.http.post<User>(this.serverURL + "/users", user, this.httpOptions);
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
}
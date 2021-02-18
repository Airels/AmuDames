import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.models';
import { News } from '../models/news.models';

export class HttpService {
    private serverURL = "http://localhost:8080";
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    constructor(private http: HttpClient) {

    }

    // User management
    public loginUser(user: User): Observable<any> {
        //if (user.username == undefined || user.password == undefined) return 400;

        return this.http.post(this.serverURL + '/login', user, this.httpOptions);
    }
/*
    public registerUser(user: User): Observable<any> {
        if (user.username == undefined 
            || user.password == undefined 
            || user.email == undefined
            /* || user.country == undefined ) //return 400;

        return this.http.post(this.serverURL + '/register', user, this.httpOptions);
    }
    */
    
    public getCurrentUser(): Observable<User> {
        return this.http.get<User>(this.serverURL + '/user/');
    }

    public getUserByID(id: number): Observable<User> {
        return this.http.get<User>(this.serverURL + `/user/id/${id}`);
    }

    public getUserByName(username: string): Observable<any> {
        return this.http.get<User>(this.serverURL + `/user/username/${username}`);
    }

    public createUser(user: User): Observable<User> {
        return this.http.post<User>(this.serverURL + "/users", user, this.httpOptions);
    }

    public deleteUser(): Observable<any> {
        return this.http.delete(this.serverURL + "/user");
    }

    public updateUser(user: User): Observable<any> {
        return this.http.put(this.serverURL + '/user', user, this.httpOptions);
    }

    // News management
    public getNews(nb: number): Observable<News[]> {
        return this.http.get<News[]>(this.serverURL + `/news/${nb}`);
    }
}
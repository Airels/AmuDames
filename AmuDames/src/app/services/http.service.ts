import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.models';

export class HttpService {
    private serverURL = "http://localhost:8080";
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    constructor(private http: HttpClient) {

    }
/*
    public getCurrentUser(): Observable<User> {
        return this.http.get(this.serverURL + '/user/');
    }

    public getUserByID(id: number): Observable<User> {
        return this.http.get(this.serverURL + `/user/id/${id}`);
    }

    public getUserByName(username: string): Observable<User> {
        return this.http.get(this.serverURL + `/user/username/${username}`);
    }

    public createUser(user: User): Observable<User> {
        return this.http.post<User>(this.serverURL + "/users", user, this.httpOptions);
    }

    public deleteUser(): Observable<any> {
        return this.http.delete(this.serverURL + "/user");
    }
    */
}
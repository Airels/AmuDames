import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user.models';
import { HttpService } from './http.service';

@Injectable()
export class UserService {

    private user!: User | null;
    public userSubject: Subject<any> = new Subject<any>();

    constructor(private httpService: HttpService) {
        this.userSubject.next(this.user);
    }

    public connect(newUser: User) {
        this.user = newUser;
        this.userSubject.next(this.user);
    }

    public disconnect() {
        this.httpService.disconnect().subscribe((res) => {
            if (res.status == 200) {
                this.user = null;
                this.userSubject.next(this.user);
                alert("You are successfully disconnected !");
            } else {
                alert("An error occured during disconnection, refresh page to continue. (Code " + res.status + ")");
            }
        });
    }
}
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user.models';
import { AuthGuard } from './auth-guard.service';
import { GameManagerService } from './game-manager.service';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class UserService {

    private user!: User | null;
    private viewUser!: User | null;
    public userSubject: Subject<any> = new Subject<any>();
    public viewUserSubject: Subject<any> = new Subject<any>();

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

    // Limit the method to few services only with method signature (no need subscription for this service)
    public getUser(authorizedService: AuthGuard | GameManagerService): User | null {
        return this.user;
    }

    public addViewUser(username: string): void {
        this.httpService.getUserByUsername(username).subscribe({
            next: res => {
              if (res.status == 200)
                this.viewUser = res.users[0];
              else
                alert("Error while getting user")
            },
            error: e => {
              alert("Error whille getting user: " + e);
            },
            complete: () => {
                this.viewUserSubject.next(this.viewUser);
            },
          });
    }

    public getViewUser(): User | null {
        return this.viewUser;
    }

    public emitUser() {
        this.userSubject.next(this.user);
    }

    public emitViewUser() {
        this.viewUserSubject.next(this.viewUser);
    }
}
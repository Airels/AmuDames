import { Subject } from 'rxjs';
import { User } from '../models/user.models';

export class UserService {

    private user!: User | null;
    public userSubject: Subject<any> = new Subject<any>();

    constructor() {
        this.userSubject.next(this.user);
    }

    public connect(newUser: User) {
        this.user = newUser;
        this.userSubject.next(this.user);
        console.log(this.user.isAdmin);
    }

    public disconnect() {
        this.user = null;
        this.userSubject.next(this.user);
    }
}
import { User } from '../models/user.models';

export class UserService {

    user!: User | null;

    constructor() {}

    public connect(newUser: User) {
        this.user = newUser;
    }

    public disconnect() {
        this.user = null;
    }
}
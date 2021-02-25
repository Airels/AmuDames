
export class AuthService {
    isAuth: boolean = false;

    signIn(form: any) {
        return new Promise(
        (resolve, reject) => {
            if(form != null && form != undefined) { this.isAuth = true; }
            else {
                //todo error
            }
        }
        );
    }
    signOut() {
        this.isAuth = false;
    }
}
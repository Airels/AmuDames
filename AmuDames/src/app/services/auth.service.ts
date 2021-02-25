export class AuthService {
    isAuth: boolean = false;
    signIn() {
        return new Promise(
        (resolve, reject) => {
            setTimeout(
                () => {
                    this.isAuth = true;
                    resolve(true);
                }, 100
            );
        }
        );
    }
    signOut() {
        this.isAuth = false;
    }
}
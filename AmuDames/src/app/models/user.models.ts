export class User {
    constructor(
        public username: string,
        public password: string,
        public email: string,
        public elo: number,
        public profileImageURL: string,
        public country: string,
        public description: string,
        public isAdmin: boolean
    ) { }
}
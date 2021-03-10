export class User {
    constructor(
        public username: string,
        public password: string | undefined,
        public email: string, //removed undefined 
        public elo: number | undefined,
        public profileImageURL: string,
        public country: string,
        public description: string | undefined,
        public isAdmin: boolean
    ) { }
}
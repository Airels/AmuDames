export class News {
    constructor(
        public title: string,
        public type: string,
        public date: string | undefined,
        public content: string
    ) {}
}
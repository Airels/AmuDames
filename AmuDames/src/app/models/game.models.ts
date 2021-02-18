import { User } from "./user.models";

export class Game {
    playerTurn: number = 0;
    
    constructor(
        public id: number,
        public whiteUser: User,
        public blackUser: User,
        public startTime: string,
        public cases: {}
    ) { }

    /*
        0 = none
        1 = white pawn
        2 = black pawn
        3 = white queen
        4 = black qween
    */
    public getCase(row: number, column: string): number {
        return this.cases[row+column];
    }

    public getPlayerTurn(): number {
        return this.playerTurn;
    }

    public setPlayerTurn(): void {
        this.playerTurn = (this.playerTurn+1)%2;
    }
}
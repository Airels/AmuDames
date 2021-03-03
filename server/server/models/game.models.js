class Game {
    constructor(id, whiteUser, blackUser, startTime, cases) { 
        this.id = id;
        this.whiteUser = whiteUser;
        this.blackUser = blackUser;
        this.startTime = startTime;
        this.playerTurn = 0;
        this.cases = cases;
    }
}
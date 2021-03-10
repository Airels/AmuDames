import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Game } from '../models/game.models';
import { User } from '../models/user.models';
import { HttpService } from './http.service';
import { UserService } from './user.service';
import { WebSocketService } from './web-socket.service';

@Injectable({providedIn: 'root'})
export class GameManagerService {
    private game!: Game;
    gameSubject: Subject<Game> = new Subject<Game>();
    gameID!: string;
    playerID!: number;
    user!: User;
    connected: boolean = false;
    cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    private connectionSubscription!: Subscription;

    constructor(private userService: UserService, private ws: WebSocketService, private httpService: HttpService, private router: Router) {}

    public searchGame(): void {
        if (this.connected) {
            this.router.navigate(['/game']);
            return;
        }

        this.httpService.gameFinderStart().subscribe((res) => {
            switch (res.status) {
                case 409:
                    alert("Another instance of your account is actually finding a game, please disconnect from your previous session to continue.");
                    this.router.navigate(['/home']);
                    break;
                case 201:
                    this.createGame(res);
                    break;
                case 205:
                    break;
                default:
                    alert("An error occured. Please try again later. (" + res.status + ")");
            }
        });
    }

    public stopSearch(): void {
        if (this.connected) return;
        this.httpService.gameFinderStop().subscribe((res) => {
            // console.log(res);
        });
    }

    public createGame(res: any): void {
        this.game = new Game(res.id, res.game.whiteUser, res.game.blackUser, res.game.startTime, this.createCases());
        this.gameID = res.id;
        this.playerID = res.playerID;

        this.user = <User>this.userService.getUser(this);

        this.serverConnection();
    }

    public serverConnection() {
        this.connectionSubscription = this.ws.createObservableSocket('ws://localhost:8085').subscribe((data) => {
            // console.log("< " + data);

            if (data == "AmuDames Game Manager") {
                let command = "CONNECT " + this.gameID + " " + this.user.email;
                this.ws.sendMessage(command);
            } else if (data == "CONNECTED") {
                this.router.navigate(['/game']);
                this.connected = true;
            } else if (data.startsWith("UPDATE")) {
                let moves = JSON.parse(data.split(' ')[1]);

                for (let move in moves) {
                    let grid = moves[move];
                    this.game.cases[grid.col+grid.row] = grid.value;
                }

                this.game.setPlayerTurn();
                this.emitGame();
            } else if (data.startsWith("END")) {
                let winnerID = data.split(' ')[2];

                if (winnerID !== this.playerID.toString()) {
                    alert("You LOST!");
                }
                else {
                    alert("You WON!");
                }

                this.reset();
            }
        });
    }

    public isPlayerTurn(): boolean {
        return (this.game.getPlayerTurn() == this.playerID);
    }

    public movePawn(source: any, target: any): void {
        let aSource = source.splice(',');
        let aTarget = target.splice(',');

        let jSource = {
            row: aSource[0],
            col: this.cols[aSource[1]]
        }
        let jTarget = {
            row: aTarget[0],
            col: this.cols[aTarget[1]]
        }

        if (jSource.col == 'ERR') {
            console.error("ERROR: Wrong column coordinates")
            return;
        }
        if (jTarget.col == 'ERR') {
            console.error("ERROR: Wrong column coordinates")
            return;
        }

        if (this.connected) {
            let command = "MOVE " + JSON.stringify(jSource) + " " + JSON.stringify(jTarget);
            this.ws.sendMessage(command); 
        }
    }

    public surrend() {
        let command = "SURRENDER";
        this.ws.sendMessage(command);
    }

    public quit() {
        let command = "QUIT";
        this.ws.sendMessage(command);
    }

    public emitGame() {
        this.gameSubject.next(this.game);
    }

    private createCases(): any[] {
        var cases:any = [];
        let rows:number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let colIndex: number;
    
        rows.forEach(row => {
            colIndex = 0;
    
            this.cols.forEach(col => {
                if (row < 4) { // Blancs
                    if (row % 2 == colIndex % 2)    cases[col+row] = 1;
                    else                            cases[col+row] = 0;
                } else if (row > 5) { // Noirs
                    if (row % 2 == colIndex % 2)    cases[col+row] = 2;
                    else                            cases[col+row] = 0;
                } else 
                    cases[col+row] = 0;
    
                colIndex++;
            });
        });
    
        return cases;
    }

    public reset() {
        this.quit();
        this.connected = false;
        this.connectionSubscription.unsubscribe()
        this.router.navigate(['/home']);

        this.httpService.getCurrentUser().subscribe((res) => {
            this.userService.updateUser(res.user);
        });
    }
}
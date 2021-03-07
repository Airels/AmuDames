import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
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

    constructor(private userService: UserService, private ws: WebSocketService, private httpService: HttpService, private router: Router) {}

    public searchGame(): void {
        console.log(this.game !== undefined);
        if (this.game !== undefined) return;

        console.log("ADD");

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
                    console.log("Search stopped by user");
                    break;
                default:
                    alert("An error occured. Please try again later. (" + res.status + ")");
            }
        });
    }

    public stopSearch(): void {
        console.log("STOP");
        this.httpService.gameFinderStop().subscribe((res) => {
            console.log(res);
        });
    }

    public createGame(res: any): void {
        this.game = new Game(res.game.id, res.game.whiteUser, res.game.blackUser, res.game.startTime, res.game.cases);
        this.gameID = res.id;
        this.playerID = res.playerID;

        this.user = <User>this.userService.getUser(this);

        this.serverConnection();
    }

    public serverConnection() {
        this.ws.createObservableSocket('ws://localhost:8085').subscribe((data) => {
            console.log("< " + data);

            if (data == "AmuDames Game Manager") {
                let command = "CONNECT " + this.gameID + " " + this.user.email;
                this.ws.sendMessage(command);
            } else if (data == "CONNECTED") {
                this.router.navigate(['/game']);
                this.connected = true;
            } else if (data.startsWith("UPDATE")) {
                let moves = JSON.parse(data.split(' ')[1]);

                console.log(moves);

                for (let move in moves) {
                    let grid = moves[move];
                    this.game.cases[grid.col+grid.row] = grid.value;
                }

                this.game.setPlayerTurn();
                this.emitGame();
            } else if (data == "WIN") {
                // Player win
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
            row: aSource[0]+1,
            col: this.cols[aSource[1]]
        }
        let jTarget = {
            row: aTarget[0]+1,
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

    public quit() {
        let command = "QUIT";
        this.ws.sendMessage(command);
    }

    public emitGame() {
        this.gameSubject.next(this.game);
    }
}
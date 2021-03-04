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

    constructor(private userService: UserService, private ws: WebSocketService, private httpService: HttpService, private router: Router) {}

    public searchGame(): void {
        this.httpService.gameFinderStart().subscribe((res) => {
            if (res.status == 409) {
                alert("Another instance of your account is actually finding a game, please disconnect from your previous session to continue.");
                this.router.navigate(['/home']);
            } else if (res.status == 201) {
                alert("MATCH FOUND! PREPARE TO BATTLE! BAYBLADE!");
                this.createGame(res);
            } else {
                alert("An error occured. Please try again later.");
            }
        });
    }

    public stopSearch(): void {
        this.httpService.gameFinderStop().subscribe((res) => {
            console.log(res);
        });
    }

    public createGame(res: any): void {
        this.game = res.game;
        this.gameID = res.id;
        this.playerID = res.playerID;

        this.user = <User>this.userService.getUser(this);

        this.serverConnection();
    }

    public serverConnection() {
        this.ws.createObservableSocket('ws://localhost:8085').subscribe((data) => {
            console.log(data);

            if (data == "AmuDames Game Manager") {
                let command = "CONNECT " + this.gameID + " " + this.user.email + " password";
                this.ws.sendMessage(command);
            } else if (data == "CONNECTED") {
                this.router.navigate(['/game']);
                this.connected = true;
            } else if (data.startsWith("UPDATE")) {
                let moves = JSON.parse(data.split(' ')[1]);

                for (let grid in moves) {
                    console.log(grid);
                    // this.game.cases[grid] = grid;
                }
            }
        });
    }

    public isPlayerTurn(): boolean {
        return (this.game.getPlayerTurn() == this.playerID);
    }

    public movePawn(source: any, target: any): void {
        if (this.connected) {
            let command = "MOVE " + source + " " + target;
            this.ws.sendMessage(command); 
        }
    }
}
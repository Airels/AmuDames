import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as G from 'glob';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game.models';
import { User } from '../models/user.models';
import { HttpService } from './http.service';
import { UserService } from './user.service';
import { WebSocketService } from './web-socket.service';

@Injectable({providedIn: 'root'})
export class GameManagerService {
    gameID!: number;
    playerID!: number;
    cases!: any;
    user!: User;

    constructor(private userService: UserService, private ws: WebSocketService, private httpService: HttpService, private router: Router) {}

    public createGame(res: any): void {
        this.gameID = res.id;
        this.playerID = res.playerID;
        this.cases = res.cases;

        this.user = <User>this.userService.getUser(this);

        this.ws.createObservableSocket('ws://localhost:8085').subscribe((data) => {
            console.log(data);

            if (data == "AmuDames Game Manager") {
                let command = "CONNECT " + this.gameID + this.user.email + " password ";
                console.log("> " + command);
                this.ws.sendMessage(command);
            }

            if (data == "CONNECTED")
                this.router.navigate(['/game']);
        });
    }

    public searchGame(): void {
        this.httpService.gameFinderStart().subscribe((res) => {
            if (res.status == 409) {
                alert("Another instance of your account is actually finding a game, please disconnect from your previous session to continue.");
                this.router.navigate(['/home']);
            } else if (res.status == 201) {
                alert("MATCH FOUND! PREPARE TO BATTLE! BAYBLADE!");
                this.createGame(res);
                // this.router.navigate(['/game']);
            } else {
                alert("An error occured. Please try again later.");
                console.log(res);
            }
        });
    }

    public stopSearch(): void {
        this.httpService.gameFinderStop().subscribe((res) => {
            console.log(res);
        });
    }
}
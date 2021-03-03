import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game.models';
import { HttpService } from './http.service';

@Injectable({providedIn: 'root'})
export class GameManagerService {
    game!: Game;

    constructor(private httpService: HttpService, private router: Router) {}

    public createGame(): void {
        
    }

    public searchGame(): void {
        this.httpService.gameFinderStart().subscribe((res) => {
            if (res.status == 409) {
                alert("Another instance of your account is actually finding a game, please disconnect from your previous session to continue.");
                this.router.navigate(['/home']);
            } else if (res.status == 201) {
                alert("MATCH FOUND! PREPARE TO BATTLE! BAYBLADE!");
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
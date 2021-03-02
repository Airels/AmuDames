import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game.models';
import { HttpService } from './http.service';

@Injectable({providedIn: 'root'})
export class GameManagerService {
    game!: Game;

    constructor(private httpService: HttpService) {}

    public createGame(): void {
        
    }

    public searchGame(): void {
        this.httpService.gameFinderStart().subscribe((res) => {
            console.log(res);
        });
    }

    public stopSearch(): void {
        this.httpService.gameFinderStop().subscribe((res) => {
            console.log(res);
        });
    }
}
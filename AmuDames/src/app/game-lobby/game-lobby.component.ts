import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameManagerService } from '../services/game-manager.service';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.scss']
})
export class GameLobbyComponent implements OnInit, OnDestroy {

  constructor(private gameManager: GameManagerService) { }

  ngOnInit(): void {
    this.gameManager.searchGame();
  }

  ngOnDestroy(): void {
    this.gameManager.stopSearch();
  }

}

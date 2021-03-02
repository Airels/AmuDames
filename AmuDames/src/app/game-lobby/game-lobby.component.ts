import { Component, OnInit } from '@angular/core';
import { GameManagerService } from '../services/game-manager.service';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.scss']
})
export class GameLobbyComponent implements OnInit {

  constructor(private gameManager: GameManagerService) { }

  ngOnInit(): void {
    this.gameManager.searchGame();
  }

}

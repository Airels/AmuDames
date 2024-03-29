import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from '../models/game.models';
import { User } from '../models/user.models';
import { GameManagerService } from '../services/game-manager.service';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, OnDestroy {
  //Canvas variables
  @ViewChild('canvas', {static: true}) canvas?: ElementRef<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D | null;
  bound: any;
  x: number = 0; y: number = 0;
  nRow: number =  10;
  sizeMen: number = 10;
  sizeDame: number = 20;
  selected?: number[] = [];

  //Game variables
  user!: User;
  opponent!: User;
  isWhite: boolean = true;
  isPlaying: boolean = true;
  game!: Game;
  board?: number[][] = [];

  gameSubscription!: Subscription;

  constructor(private router: Router, private gameService : GameManagerService, private webSocket : WebSocketService) { 
    this.board = [
      [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    ];

    //alert if reload

    //todo service board to convert

    //todo convert function of game manager service to subscribable item or one that return all game
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    return false;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event) {
    this.gameService.surrend();
  }

  /*
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.initCanvas();
  }
  */

  ngOnInit(): void {
    this.gameSubscription = this.gameService.gameSubject.subscribe((game) => {
      this.game = game;
      this.isPlaying = (game.playerTurn == this.gameService.playerID);
      
      for (let i = 0; i < 10; i++) {
        let board:any = this.board;
        for (let j = 0; j < 10; j++) {
          let pos = this.gameService.cols[j] + i;
          board[i][j] = game.cases[pos];
        }

        board[i] = board[i].reverse();
      }

      if(this.isWhite) { this.reverseBoard(); } 
      this.drawProps();
    });
    this.gameService.emitGame();
    
    this.isWhite = (this.gameService.playerID == 0);

    this.user = (this.isWhite) ? this.game.whiteUser : this.game.blackUser;
    this.opponent = (this.isWhite) ? this.game.blackUser : this.game.whiteUser;


    if(this.canvas != undefined) {
      if(!this.isWhite) { this.reverseBoard(); } 

      //draw canvas
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.initCanvas();
      this.bound = this.canvas.nativeElement.getBoundingClientRect();

      //event listener: select a paws
      this.canvas.nativeElement.addEventListener('click', e => {
        if (this.isPlaying === true && this.ctx != null && this.canvas != null && this.board != null) {
          this.bound = this.canvas.nativeElement.getBoundingClientRect();
          this.x = e.clientX - this.bound.left;
          this.y = e.clientY - this.bound.top;
          let w = this.canvas.nativeElement.width/this.nRow;
          let pos = this.getPosition();
          if((this.board[pos[0]][pos[1]] == 1) && this.isWhite) {
            this.initCanvas();
            this.drawWhitePawn(pos[1], pos[0], w, this.sizeMen, true); 
            this.selected = [pos[0], pos[1]]; this.drawOracle(pos[0], pos[1], false, true);
          } else if((this.board[pos[0]][pos[1]] == 2) && !this.isWhite) {
            this.initCanvas();
            this.drawBlackPawn(pos[1], pos[0], w, this.sizeMen, true); 
            this.selected = [pos[0], pos[1]]; this.drawOracle(pos[0], pos[1], false, false);
          } else if((this.board[pos[0]][pos[1]] == 3) && this.isWhite) {
            this.initCanvas();
            this.drawWhitePawn(pos[1], pos[0], w, this.sizeDame, true); 
            this.selected = [pos[0], pos[1]]; this.drawOracle(pos[0], pos[1], false, true);
          } else if((this.board[pos[0]][pos[1]] == 4) && !this.isWhite) {
            this.initCanvas();
            this.drawBlackPawn(pos[1], pos[0], w, this.sizeDame, true); 
            this.selected = [pos[0], pos[1]]; this.drawOracle(pos[0], pos[1], false, false);
          }
        }
      });
      //event listener: move if selected
      this.canvas.nativeElement.addEventListener('click', e => {
        if (this.isPlaying === true && this.ctx != null && this.canvas != null && this.board != null) {
          this.bound = this.canvas.nativeElement.getBoundingClientRect();
          this.x = e.clientX - this.bound.left;
          this.y = e.clientY - this.bound.top;
          let w = this.canvas.nativeElement.width/this.nRow;
          let pos = this.getPosition();
          //convert from computer value to math value (change start 0 to start 1)
          if(this.selected?.length == 2 && this.selected[0] != pos[0] && this.selected[1] != pos[1] && this.isPlaying) {
            if(this.isWhite) {
              this.selected[0] = (9-this.selected[0]);
              pos[0] = (9-pos[0]);
              this.initCanvas();
              this.gameService.movePawn(this.selected, pos);
            } else {
              this.selected[1] = (9-this.selected[1]);
              pos[1] = (9-pos[1]);
              this.initCanvas();
              this.gameService.movePawn(this.selected, pos);
            }
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
    
    if (this.gameService.connected)
      this.gameService.surrend();
  }

  reverseBoard(): void {
    if(this.board != null) {
      for(let i = 0; i<this.board?.length; i++) {
        this.board[i] = this.board[i].reverse();
      }
      this.board = this.board.reverse();
    }
  }

  initCanvas(): void {
    if (this.ctx != null && this.canvas != null) {
      let w = this.canvas.nativeElement.width/this.nRow;

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      for (var i = 0; i<this.nRow; i++) {
          for (var j = 0, col = this.nRow/2; j < col; j++) {
              this.ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * w, w, w);
          }
      }
      this.ctx.fill();
      this.drawProps();
    }
  }

  getPosition(): number[] {
    if (this.ctx != null && this.canvas != null && this.board != null) {
      let w = this.canvas.nativeElement.width/this.nRow;
      for (var i = 0; i<this.nRow; i++) {
        for (var j = 0; j<this.nRow; j++) {
          if((this.x > j*w && this.x < (j+1)*w) && (this.y > i*w && this.y < (i+1)*w)) {
            return [i, j];
          }
        }
      }
    }
    return [0, 0];
  }

  drawOracle(x: number, y: number, isDame: boolean, isWhite: boolean): void {
    //todo draw position reachable
  }

  drawProps(): void {
    if (this.ctx != null && this.canvas != null && this.board != null) {
      let w = this.canvas.nativeElement.width/this.nRow;
      let h = this.canvas.nativeElement.height/this.nRow;

      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      for (var i = 0; i<this.nRow; i++) {
          for (var j = 0, col = this.nRow/2; j < col; j++) {
              this.ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
          }
      }
      this.ctx.fill();

      for (var i = 0; i<this.nRow; i++) {
        for (var j = 0; j<this.nRow; j++) {
          if(this.board[j][i] == 1) {this.drawWhitePawn(i, j, w, this.sizeMen, false); }
          else if(this.board[j][i] == 2) {this.drawBlackPawn(i, j, w, this.sizeMen, false); }
          else if(this.board[j][i] == 3) {this.drawWhitePawn(i, j, w, this.sizeDame, false); }
          else if(this.board[j][i] == 4) {this.drawBlackPawn(i, j, w, this.sizeDame, false); }
        }
      }

    }
  }

  drawWhitePawn(x: number, y: number, pos: number, radius: number, isSelected: boolean): void {
    let centerX = x*pos + pos/2;
    let centerY = y*pos + pos/2;
    if (this.ctx != null && this.canvas != null) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      (isSelected)? this.ctx.strokeStyle = 'green' : this.ctx.strokeStyle = 'black';
      this.ctx.stroke();
    }
  }

  drawBlackPawn(x: number, y: number, pos: number, radius: number, isSelected: boolean): void {
    let centerX = x*pos + pos/2;
    let centerY = y*pos + pos/2;
    if (this.ctx != null && this.canvas != null) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'black';
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      (isSelected)? this.ctx.strokeStyle = 'green' : this.ctx.strokeStyle = 'white';
      this.ctx.stroke();
    }
  }
}

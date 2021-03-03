import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas?: ElementRef<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D | null;
  bound: any;
  x: number = 0; y: number = 0;
  nRow: number =  10;
  board?: number[][] =
  [
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
  ];
  sizeMen: number = 10;
  sizeDame: number = 20;
  selected?: number[] = [0, 0];

  user!: User | null;
  opponent!: User | null;
  isWhite: boolean = false;
  isPlaying: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(this.canvas != undefined) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.initCanvas();
      this.bound = this.canvas.nativeElement.getBoundingClientRect();

      //event listener : drawing for test
      this.canvas.nativeElement.addEventListener('mousemove', e => {
        if (this.ctx != null && this.canvas != null) {
          this.x = e.clientX - this.bound.left;
          this.y = e.clientY - this.bound.top;
          this.ctx.fillStyle = 'gold';
          this.ctx.fillRect(this.x, this.y, 10, 10);
        }
      });

      //event listener: select a paws
      this.canvas.nativeElement.addEventListener('click', e => {
        if (this.isPlaying === true && this.ctx != null && this.canvas != null && this.board != null) {
          this.x = e.clientX - this.bound.left;
          this.y = e.clientY - this.bound.top;
          let w = this.canvas.nativeElement.width/this.nRow;
          let pos = this.getPosition();
          if((this.board[pos[0]][pos[1]] == 1 || this.board[pos[0]][pos[1]] == 2) && this.isWhite) {
            this.initCanvas();
            this.drawWhiteMen(pos[1], pos[0], w, this.sizeMen, true); 
            this.selected = [pos[0], pos[1]];
          } else if((this.board[pos[0]][pos[1]] == 3 || this.board[pos[0]][pos[1]] == 4) && !this.isWhite) {
            this.initCanvas();
            this.drawBlackMen(pos[1], pos[0], w, this.sizeMen, true); 
            this.selected = [pos[0], pos[1]];
          }
        }
      });
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
          if(this.board[j][i] == 1) {this.drawWhiteMen(i, j, w, this.sizeMen, false); }
          if(this.board[j][i] == 3) {this.drawBlackMen(i, j, w, this.sizeMen, false); }
          //todo les dames
        }
      }

    }
  }

  drawWhiteMen(x: number, y: number, pos: number, radius: number, isSelected: boolean): void {
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

  drawBlackMen(x: number, y: number, pos: number, radius: number, isSelected: boolean): void {
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

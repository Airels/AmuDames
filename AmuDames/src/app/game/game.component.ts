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
  isPlaying: boolean = false;
  bound: any;
  board?: number[][] =
  [
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

  user!: User | null;
  opponent!: User | null;

  x: number = 0; y: number = 0;

  constructor() { }

  ngOnInit(): void {
    if(this.canvas != undefined) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.initCanvas();
      this.bound = this.canvas.nativeElement.getBoundingClientRect();

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
      ]

      //event listener : drawing
      this.canvas.nativeElement.addEventListener('mousemove', e => {
        if (this.isPlaying === true && this.ctx != null && this.canvas != null) {
          this.x = e.clientX - this.bound.left;
          this.y = e.clientY - this.bound.top;
          this.ctx.fillRect(this.x, this.y, 10, 10);
        }
      });
    }
  }

  initCanvas(): void {
    if (this.ctx != null && this.canvas != null) {
      let nRow =  10;
      let nCol = 10;
      let w = this.canvas.nativeElement.width/nRow;
      let h = this.canvas.nativeElement.height/nCol;

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      for (var i = 0; i<nRow; i++) {
          for (var j = 0, col = nCol/2; j < col; j++) {
              this.ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
          }
      }
      this.ctx.fill();
      this.drawProps();
    }
  }

  drawProps() {
    if (this.ctx != null && this.canvas != null && this.board != null) {
      let nRow =  10;
      let nCol = nRow;
      let sizeMen = 10;
      let sizeDame = 20;
      let w = this.canvas.nativeElement.width/nRow;
      let h = this.canvas.nativeElement.height/nCol;

      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      for (var i = 0; i<nRow; i++) {
          for (var j = 0, col = nCol/2; j < col; j++) {
              this.ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
          }
      }
      this.ctx.fill();

      for (var i = 0; i<nRow; i++) {
        for (var j = 0; j<nCol; j++) {
          if(this.board[i][j] == 1) {this.drawWhiteMen(i, j, w, sizeMen); }
          if(this.board[i][j] == 2) {this.drawBlackMen(i, j, w, sizeMen); }
        }
      }

    }
  }

  drawWhiteMen(x: number, y: number, pos: number, radius: number) {
    let centerX = x*pos + pos/2;
    let centerY = y*pos + pos/2;
    if (this.ctx != null && this.canvas != null) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'black';
      this.ctx.stroke();
    }
  }

  drawBlackMen(x: number, y: number, pos: number, radius: number) {
    let centerX = x*pos + pos/2;
    let centerY = y*pos + pos/2;
    if (this.ctx != null && this.canvas != null) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'black';
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'white';
      this.ctx.stroke();
    }
  }



}

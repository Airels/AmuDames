import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { RankingComponent } from './ranking/ranking.component';
import { GuideComponent } from './guide/guide.component';
import { GameManagerService } from './services/game-manager.service';
import { HttpService } from './services/http.service';
import { WebSocketService } from './services/web-socket.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayComponent,
    RankingComponent,
    GuideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GameManagerService,
    HttpService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

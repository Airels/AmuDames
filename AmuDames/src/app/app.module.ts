import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { RankingComponent } from './ranking/ranking.component';
import { GuideComponent } from './guide/guide.component';
import { GameManagerService } from './services/game-manager.service';
import { HttpService } from './services/http.service';
import { WebSocketService } from './services/web-socket.service';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { NewsService } from './services/news.service';
import { NewsEditModalComponent } from './news-edit-modal/news-edit-modal.component';
import { GameLobbyComponent } from './game-lobby/game-lobby.component';
import { GameComponent } from './game/game.component';
import { AuthGuardInGame } from './services/auth-guard-in-game.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayComponent,
    RankingComponent,
    GuideComponent,
    UserProfileComponent,
    NewsEditModalComponent,
    GameLobbyComponent,
    GameComponent
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
    WebSocketService,
    AuthService,
    AuthGuard,
    UserService,
    NewsService,
    AuthGuardInGame
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

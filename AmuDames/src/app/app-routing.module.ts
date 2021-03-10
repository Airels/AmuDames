import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameLobbyComponent } from './game-lobby/game-lobby.component';
import { GameComponent } from './game/game.component';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { RankingComponent } from './ranking/ranking.component';
import { AuthGuardInGame } from './services/auth-guard-in-game.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', canActivate: [AuthGuardInGame], component:  HomeComponent },
  { path: 'search', canActivate: [AuthGuard, AuthGuardInGame], component: GameLobbyComponent },
  { path: 'ranking', canActivate: [AuthGuardInGame], component: RankingComponent },
  { path: 'guide', canActivate: [AuthGuardInGame], component: GuideComponent },
  { path: 'user-profile/:username', canActivate: [AuthGuard, AuthGuardInGame], component: UserProfileComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

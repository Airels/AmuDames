import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameLobbyComponent } from './game-lobby/game-lobby.component';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { RankingComponent } from './ranking/ranking.component';
import { AuthGuard } from './services/auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component:  HomeComponent },
  { path: 'search', canActivate: [AuthGuard], component: GameLobbyComponent },
  { path: 'play', canActivate: [AuthGuard], component:  PlayComponent },
  { path: 'ranking', canActivate: [AuthGuard], component: RankingComponent },
  { path: 'guide', component: GuideComponent },
  { path: 'user-profile', canActivate: [AuthGuard], component: UserProfileComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

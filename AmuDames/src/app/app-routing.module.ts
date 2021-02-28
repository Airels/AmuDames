import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { PlayComponent } from './play/play.component';
import { RankingComponent } from './ranking/ranking.component';
import { AuthGuard } from './services/auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component:  HomeComponent },
  { path: 'play', canActivate: [AuthGuard], component:  PlayComponent },
  { path: 'ranking', canActivate: [AuthGuard], component: RankingComponent },
  { path: 'guide', component: GuideComponent },
  { path: 'user-profile', canActivate: [AuthGuard], component: UserProfileComponent },
  { path: 'news-edit', canActivate: [AuthGuard], component: NewsEditComponent}, //todo add guard admin
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

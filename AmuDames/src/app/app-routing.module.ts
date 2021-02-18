import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { RankingComponent } from './ranking/ranking.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component:  HomeComponent },
  { path: 'play', component:  PlayComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'guide', component: GuideComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

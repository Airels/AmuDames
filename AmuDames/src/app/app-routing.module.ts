import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component:  HomeComponent },
  { path: 'play', component:  PlayComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'guide', component: GuideComponent },
  { path: 'not-found', component: 'home' },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

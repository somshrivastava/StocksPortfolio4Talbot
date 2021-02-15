import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { ScoreboardPageComponent } from './components/scoreboard-page/scoreboard-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePortfolioPageComponent } from './components/create-portfolio-page/create-portfolio-page.component';

const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'create-portfolio', component: CreatePortfolioPageComponent},
  {path: 'dashboard', component: DashboardPageComponent},
  {path: 'scoreboard', component: ScoreboardPageComponent},
  {path: '404', component: NotFoundPageComponent},
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

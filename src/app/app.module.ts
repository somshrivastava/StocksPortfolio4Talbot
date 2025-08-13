import { MessageService } from 'primeng/api';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';
import { AuthenticationService } from './services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from './../environments/environment';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { ScoreboardPageComponent } from './components/scoreboard-page/scoreboard-page.component';
import { CreatePortfolioPageComponent } from './components/create-portfolio-page/create-portfolio-page.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DashboardPageComponent,
    ScoreboardPageComponent,
    CreatePortfolioPageComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, ''),
    InputTextModule,
    InputNumberModule,
    ProgressSpinnerModule,
    ButtonModule,
    ToastModule,
    TableModule,
    ChartModule,
    DialogModule,
    HttpClientModule,
  ],
  providers: [
    AngularFirestore,
    AngularFireAuth,
    AuthenticationService,
    DataService,
    UserService,
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

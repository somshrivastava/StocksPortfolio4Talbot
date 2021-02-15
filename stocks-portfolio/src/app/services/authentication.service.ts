import { Stock } from './../models/stock.model';
import { StocksService } from './stocks.service';
import { UserService } from './user.service';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private subscription: Subscription = new Subscription();

  private user: any;

  constructor (
    private authentication: AngularFireAuth, 
    private router: Router, 
    private dataService: DataService,
    private userService: UserService,
    private stocksService: StocksService
  ) {
    this.user = {
      userID: "",
      email: "",
      name: "",
      photoURL: "",
      portfolioID: ""
    }
  }

  public signIn() { 
    return this.authLogin(new auth.GoogleAuthProvider()); 
  }

  private authLogin(provider: any) {
    return this.authentication.auth.signInWithPopup(provider)
    .then(result => {
      this.setUserData(result.user);
    })
    .catch(error => {
      window.alert(error)
    })
  }

  private setUserData(user: any) { 
    this.user = {
      userID: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      portfolioID: "",
    }
    this.subscription.add(
      this.dataService.getFirestoreDocument("users", this.user.userID).subscribe(document => {
        const userDocument: any = document.payload.data();
        if (userDocument != undefined) {
          this.dataService.createStorageKey("userID", userDocument['userID']);
          if (this.userService.isAdminUser(userDocument['email'])) {
            this.router.navigate(['scoreboard']);
          } else if (userDocument['portfolioID'].length == 0) {
            this.router.navigate(['create-portfolio']);
          } else {
            this.router.navigate(['dashboard']);
          }
          this.userService.user$.next(userDocument as any);    
        } else {
          this.userService.user$.next(this.user as any)
          this.dataService.createStorageKey("userID", this.user['userID']);
          if (this.userService.isAdminUser(this.user['email'])) {
            this.user['portfolioID'] = "ADMIN USER";
            this.router.navigate(['scoreboard']);
          } else {
            this.router.navigate(['create-portfolio']);
          }
          this.dataService.createFirestoreDocumentWithID("users", this.user.userID, this.user);
        }
      })
    )
  }

  public signOut() {
    return this.authentication.auth.signOut().then(() => {
      this.userService.user$.next(null);
      this.dataService.deleteStorageKey("userID");
      this.dataService.deleteStorageKey("isReloaded");
      this.router.navigate(['login']);
    })
  }
}
import { App } from './../app.constants';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user$ = new BehaviorSubject(null);

  private subscriptions: Subscription = new Subscription();

  constructor(
    private dataService: DataService, 
    private router: Router
  ) { }

  public wasUserLoggedIn() {
    const userID = this.dataService.getStorageKey("userID");
    if (userID != null) {
      this.subscriptions.add(
        this.dataService.getFirestoreDocument("users", userID).subscribe(document => {
          if (document.payload.data()) {
            this.user$.next(document.payload.data() as any);
            this.subscriptions.unsubscribe();
          }
        })  
      )
    } else {
      this.router.navigate(['login']);
    }
  }

  public isAdminUser(userEmail: string): boolean {
    return App.AdminEmails.includes(userEmail);
  }
}

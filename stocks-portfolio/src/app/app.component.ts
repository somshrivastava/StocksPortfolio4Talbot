import { StocksService } from './services/stocks.service';
import { RoutingHistoryService } from './services/routing-history.service';
import { DataService } from './services/data.service';
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public user: any;

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService, 
    public userService: UserService,
    public dataService: DataService,
    public stocksService: StocksService,
    private routingHistoryService: RoutingHistoryService
  ) { }

  ngOnInit() { 
    this.loadUser();
    this.userService.wasUserLoggedIn()
    // this.dataService.getFirestoreDocument("stocks-test-data", "test-data-1").subscribe(document => {
    //   this.dataService.createFirestoreDocumentWithID("stocks", "kj99m4505rp", document.payload.data())
    // })
    // this.dataService.getFirestoreDocument("stocks-test-data", "test-data-2").subscribe(document => {
    //   this.dataService.createFirestoreDocumentWithID("stocks", "cao6ppomo7n", document.payload.data())
    // })
  }

  ngOnDestroy() { 
  }

  public isShowHeader(): boolean {
    if (this.router.url.toString().includes("login")) {
      return false;
    } else {
      return true;
    }
  }

  public signOut() {
    this.authenticationService.signOut();
  }

  private loadUser() {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.routingHistoryService.loadRouting();
      }
    })
  }
}

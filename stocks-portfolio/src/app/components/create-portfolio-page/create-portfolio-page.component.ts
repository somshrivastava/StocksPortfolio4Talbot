import { Router } from '@angular/router';
import { DataService } from './../../services/data.service';
import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { invalid } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-create-portfolio-page',
  templateUrl: './create-portfolio-page.component.html',
  styleUrls: ['./create-portfolio-page.component.scss']
})
export class CreatePortfolioPageComponent implements OnInit, OnDestroy {
  public isLoaded: boolean = false;

  public user: any = {};

  private subscriptions: Subscription = new Subscription();

  public portfolio: any = {
    portfolioID: this.dataService.returnRandomID(),
    stocks:  [
      {
        name: "",
        price: null,
        symbol: ""
      },
      {
        name: "",
        price: null,
        symbol: ""
      },
      {
        name: "",
        price: null,
        symbol: ""
      }
    ]
  };

  private invalidFields: number = 0;

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadUser() {
    this.subscriptions.add(
      this.userService.user$.subscribe(user => {
        if (user) {
          this.user = user;
          this.isLoaded = true;
        }
      })
    )
  }

  public createPortfolio() {
    this.portfolio['stocks'].forEach((stock: any) => {
      Object.keys(stock).forEach((key: string) => {
        if (stock[key] == null || stock[key].length == 0) {
          this.invalidFields += 1
        }
      })
    })
    if (this.invalidFields == 0) {
      this.dataService.createFirestoreDocumentWithID("stocks", this.portfolio['portfolioID'], this.portfolio);
      this.dataService.updateFirestoreDocument("users", this.user['userID'], {portfolioID: this.portfolio['portfolioID']});
      this.userService.user$.next({...this.user, portfolioID: this.portfolio['portfolioID']})
      this.router.navigate(['dashboard']);
    } else {
      this.dataService.sendToastMessage({severity:'warn', sticky: false, summary:'Empty Values', detail:'Please Fill In All Required Input To Successfully Create Your Portfolio!'});
      this.invalidFields = 0;     
    }
  }
}

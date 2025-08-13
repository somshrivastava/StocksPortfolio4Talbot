import { Stock } from './../../models/stock.model';
import { StocksService } from './../../services/stocks.service';
import { DataService } from './../../services/data.service';
import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-scoreboard-page',
  templateUrl: './scoreboard-page.component.html',
  styleUrls: ['./scoreboard-page.component.scss']
})
export class ScoreboardPageComponent implements OnInit, OnDestroy {
  public scoreboard: any[] = [];
  
  private users: any[] = [];

  public stocksCollection: any[] = [];

  public user: any = {};

  public currentScoreboardUser: any = {};

  public currentStock: any = {};

  public isShowingDialog: boolean = false;

  public isLoaded: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public userService: UserService,
    private dataService: DataService,
    public stocksService: StocksService
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadUser() {
    this.subscriptions.add(
      this.userService.user$.subscribe(user => {
        if (user) {
          this.user = user;
          this.loadUsers();
        }
      })
    )
  }

  loadUsers() {
    this.subscriptions.add(
      this.dataService.getFirestoreCollection("users").subscribe(collection => {
        if (collection) {
          this.users = collection.map(document => {
            return document.payload.doc.data();
          })
          this.loadStocks();
        }
      })
    )
  }

  loadStocks() {
    this.subscriptions.add(
      this.dataService.getFirestoreCollection("stocks").subscribe(collection => {
        if (collection) {
          this.stocksCollection = collection.map(document => {
            return document.payload.doc.data();
          })
          this.loadScoreboard();
        }
      })  
    )
  }

  loadScoreboard() {
    this.scoreboard = [];
    this.users.forEach(user => {
      if (!this.userService.isAdminUser(user['email'])  && user['portfolioID'].length != 0 && !user['isCreatingPortfolio']) {
        if (this.stocksCollection.filter(stock => stock['portfolioID'] == user['portfolioID'])[0] != undefined) {
          const filteredStockCollection = this.stocksCollection.filter(stock => stock['portfolioID'] == user['portfolioID'])[0]['stocks'];
          this.scoreboard.push({...user, profits: this.stocksService.returnTotalProfit(filteredStockCollection), stocks: filteredStockCollection})  
        }
      }
    })
    this.scoreboard.sort((a, b) => parseFloat(b.profits) - parseFloat(a.profits));
    this.isLoaded = true;
  }

  editingStock(stock: Stock) {
    this.showDialog();
    this.currentStock = stock;
  } 

  editStock() {
    this.hideDialog();
    const updatedStock = this.stocksCollection.filter(stock => stock['stocks'][0]['symbol'] == this.currentStock['symbol'])[0]; 
    this.dataService.updateFirestoreDocument("stocks", updatedStock['portfolioID'], updatedStock);
  }

  deleteStock(scoreboardUser: any) {
    this.dataService.deleteFirestoreDocument("stocks", scoreboardUser['portfolioID']);
    this.dataService.deleteFirestoreDocument("users", scoreboardUser['userID']);
  }

  hideDialog() {
    this.isShowingDialog = false;
  }

  showDialog() {
    this.isShowingDialog = true;
  }
}

import { Stock } from './../../models/stock.model';
import { StocksService } from './../../services/stocks.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataService } from './../../services/data.service';
import { UserService } from './../../services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})

export class DashboardPageComponent implements OnInit, OnDestroy {
  public user: any = {};

  public stocks: any[] = [];

  private portfolioID: string = "";

  public isLoaded: boolean = false;

  private totalProfit: number = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public userService: UserService,
    private dataService: DataService,
    private http: HttpClient,
    public stocksService: StocksService
  ) { }

  ngOnInit() {
    this.loadUser();
    // if (this.dataService.getStorageKey("isReloaded") == null || this.dataService.getStorageKey("isReloaded") == undefined || this.dataService.getStorageKey("isReloaded") == false) {
    //   window.location.reload(true);
    //   this.dataService.createStorageKey("isReloaded", true);
    // }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadUser() {
    this.subscriptions.add(
      this.userService.user$.subscribe(user => {
        if (user) {
          this.user = user;
          if (this.userService.isAdminUser(this.user['email'])) {
            this.isLoaded = true;
          } else {
            this.loadUserStocks();
          }
        }
      })
    )
  }

  private loadUserStocks() {
    this.subscriptions.add(
      this.dataService.getFirestoreCollectionWithWhere("stocks", "portfolioID", "==", this.user['portfolioID']).subscribe((collection: any[]) => {
        if (collection) {
          this.stocks = collection.map(document => {
            return {
              ...document.payload.doc.data()
            }
          })[0]['stocks'];
          this.portfolioID = collection.map(document => {
            return document.payload.doc.data()
          })[0]['portfolioID'];
          const filteredStocks = this.stocks.filter((stock: Stock) => stock.data == null || stock.data == undefined); 
          if (filteredStocks.length != 0) {
            this.stocksService.loadUserStocksData(this.stocks, this.portfolioID, this.isLoaded);            
          } else {
            this.isLoaded = true;
            this.stocks.forEach((stock: Stock) => {
              this.stocksService.generateStockGraphs(this.stocks, stock);
            })
          }
        }
      })
    )
  }
}

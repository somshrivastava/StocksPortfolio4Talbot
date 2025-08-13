import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Stock } from './../models/stock.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private totalProfit: number = 0;

  private totalProfitCounter: number = 0;

  private apiWaitTime: any;

  private apiKey: string = "Q0B2USQT39UVSGXJ";

  private apiKeys: string[] = [
    "Q0B2USQT39UVSGXJ",
    "YSAP072807OHJYEN",
    "0UNA20MCF3VG3Q3S",
    "RYSDNDZ9JVWX31QF",
    "2HSJQ73ZB5TRLVNJ",
    "92TSPXM2FE1WAS2H",
    "UHEORWTP71E818RZ",
    "XA63A1JQPT0JNMHE",
    "QWCPK4BFHDKBASQN",
    "I06PQA6YMUS9Q1WA"
  ];

  selectedAPIKey: number = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) { }

  public returnShares(buyPrice: number) {
    return 1000/buyPrice;
  }

  public returnCurrentPrice(stocks: any[], stock: any) {
    var currentPrice = 0;
    if (stocks != undefined && stocks != null  && stock['data'] != null && stock['data'] != undefined) {
      currentPrice = stock['data'][Object.keys(stock['data']).sort()[Object.keys(stock['data']).length - 1]]['4. close'];
    }
    return currentPrice;
  }

  public returnCurrentProfit(currentPrice: any, buyPrice: number) {
    return (Number(currentPrice) - buyPrice) * this.returnShares(buyPrice);
  }

  public returnTotalProfit(stocks: any[]) {
    this.totalProfit = 0;
    
    if (stocks != undefined && stocks != null) {
      stocks.forEach((stock: any) => {
        this.totalProfit += this.returnCurrentProfit(this.returnCurrentPrice(stocks, stock), stock['price']);
      })
    }
    return this.totalProfit;  
  }

  public loadUserStocksData(stocks: Stock[], portfolioID: string, isLoaded?: boolean) {
    const filteredStocks = stocks.filter((stock: Stock) => stock.data == null || stock.data == undefined);
    filteredStocks.forEach((stock: Stock) => {
      if (stock.data == null || stock.data == undefined || stock.data.length == 0) {
        this.subscriptions.add(
          this.http.get(this.returnStockAPIURL(stock['symbol'])).subscribe((stockData: any) => {
            if (stockData['Error Message'] != undefined && stockData['Error Message'] != null) {
              this.router.navigate(['create-portfolio', 'invalid-details']);        
              this.subscriptions.unsubscribe();
            } else if (stockData['Note'] != undefined && stockData['Note'] != null) {
              this.dataService.sendToastMessage({severity:'warn', sticky: true, summary:'Wait Time', detail:'Please Wait.  There Is A Limit To The Number Of Calls That Can Be Made To The Free API Per Minute.  Do Not Reload The Page Or Navigate Anywhere!  Thank you!'});
              this.apiWaitTime = setTimeout(() => {
                window.location.reload();
              }, 60000);
            } else if (stockData['Time Series (Daily)'] != undefined && stockData['Time Series (Daily)'] != null) {
              stock.data = stockData['Time Series (Daily)'];
              this.generateStockGraphs(stocks, stock);
              if (filteredStocks.length == stocks.filter((stock: Stock) => stock.data != null || stock.data != undefined).length) {
                clearTimeout(this.apiWaitTime);
                this.dataService.clearToastMessage();
                this.subscriptions.unsubscribe();
                this.dataService.createStorageKey("isCreatingPortfolio", false);
                this.dataService.createFirestoreDocumentWithID("stocks", portfolioID, {portfolioID: portfolioID, stocks: stocks});          
                if (isLoaded != null) {
                  isLoaded = true;
                }
              }
            }
          })
        )
      } 
    })
  }

  public generateStockGraphs(stocks: Stock[], stock: Stock) {
    stock.isOpen = true;
    stock.graph = {
      labels: [],
      datasets: [
          {
              label: 'Close Price',
              data: [],
              fill: false,
              borderColor: '#000000'
          },
      ]
    } 
    const stockValues = Object.keys(stock.data).sort();
    stockValues.forEach(key => {
      if (key.split('-')[1] == "02" || key.split('-')[1] == "03") {
        stock.graph['datasets'][0]['data'].push(stocks[stocks.indexOf(stock)]['data'][key]['4. close'])
        var month = "";
        var day = "";
        if (key.split('-')[1] == "02") {
          month = "Feb."
        } else if (key.split('-')[1] == "03") {
          month = "Mar."
        }
        if (key.split('-')[2][0] == "0") {
          day = key.split('-')[2][1];
        } else {
          day = key.split('-')[2];
        }
        stock.graph['labels'].push(`${month} ${day}`)  
      }
    })
  }

  public returnStockAPIURL(symbol: string) {
    return 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&interval=5min&apikey=' + this.apiKey;
  }

  public isUpdatedStocksData(user: any) {
    this.dataService.getFirestoreDocument("stocks", user['portfolioID']).subscribe(document => {
      const userStocks: any = document.payload.data();
      const todayDate = this.dataService.returnTime();
      if (todayDate.day == "Sunday") {
        todayDate.date -= 1;
      } else if (todayDate.day == "Monday") {
        todayDate.date -= 2;
      }
      if (userStocks['stocks'].filter((stock: any) => stock['data'] == null || Number(Object.keys(stock['data']).sort()[Object.keys(stock['data']).length - 1].split('-')[2]) != todayDate.date - 1).length != 0) {
        userStocks['stocks'].forEach((stock: Stock) => {
          stock.data = undefined;
        })
        this.loadUserStocksData(userStocks['stocks'], userStocks['portfolioID']);        
      }
    })
  }
}

import { DataService } from './data.service';
import { NavigationEnd, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutingHistoryService {  
  public history: any[] = [];

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  public loadRouting() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((urlAfterRedirects: any) => {
        this.history = [...this.history, urlAfterRedirects['url']];
        this.dataService.createStorageKey("history", this.history);
      });
  }

  public returnPreviousRoute() {
    return this.dataService.getStorageKey("history")[this.dataService.getStorageKey("history").length - 1]
  }
}
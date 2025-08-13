import { Router } from '@angular/router';
import { RoutingHistoryService } from './../../services/routing-history.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})

export class NotFoundPageComponent implements OnInit {

  constructor(
    private routingHistoryService: RoutingHistoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate([this.routingHistoryService.returnPreviousRoute()])
  }
}

import { DataService } from './../../services/data.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {  
  ad: any;

  constructor(private authenticationService: AuthenticationService, private dataService: DataService) { }

  ngOnInit() {
    this.isUserLoggedIn();
  }

  isUserLoggedIn() {
    if (this.dataService.getStorageKey("userID")) {
      this.authenticationService.signOut();
      this.dataService.sendToastMessage({severity:'info', sticky: false, summary:'Logged Out', detail:'You reached the login page and logged out!'});
    }
  }

  public signIn() {
    this.authenticationService.signIn();
  }
}

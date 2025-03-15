import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'OAuth2-UI';
  hellotext:string="";
  constructor(private oAuthService:OAuthService,private httpClient:HttpClient) {}

  logOut(){
    this.oAuthService.logOut();
  }

  getHelloText()
  {
    this.httpClient.get<{ message: string}>('http://localhost:8081/hello',{
        headers:{
          'Authorization':`Bearer ${this.oAuthService.getAccessToken()}`
        }
    }).subscribe(result=>{
      this.hellotext=result.message;
    })
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
// import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {firebaseConfig} from "../services/config"

import { isUserAuthentcatedRoutesGuard } from './../services/isUserAuthentcated-routes-guard.service';
import { AngularFireModule } from '@angular/fire';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ChatContainerComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    NgbModule
    // PickerModule
  ],
  providers: [isUserAuthentcatedRoutesGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

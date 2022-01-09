import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
// import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { isUserAuthentcatedRoutesGuard  } from './../services/isUserAuthentcated-routes-guard.service';


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
    // PickerModule
  ],
  providers: [isUserAuthentcatedRoutesGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

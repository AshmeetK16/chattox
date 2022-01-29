import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ChatContainerComponent } from "./chat-container/chat-container.component";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { HomeComponent } from "./home/home.component";
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { firebaseConfig } from "../services/config";
import { isUserAuthentcatedRoutesGuard } from "./../services/isUserAuthentcated-routes-guard.service";
import { AuthService } from "./../services/authService";
import { FirebaseService } from "./../services/firebase";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/database";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ChatContainerComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    NgbModule,
    PickerModule
  ],
  providers: [isUserAuthentcatedRoutesGuard, AuthService, FirebaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import {FirebaseService} from "./authService"

@Injectable()
export class isUserAuthentcatedRoutesGuard implements CanActivate {
    isUserAuthenticated = true;
    constructor(
        private router: Router,
        private firebaseService: FirebaseService
    ) { }

    canActivate(): boolean | Promise<boolean> {debugger;
        if (!this.firebaseService.isLoggedIn) {
            return this.router.navigate(['/login']);
        }
    }
}

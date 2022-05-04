import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import {AuthService} from "./authService"

@Injectable()
export class isUserAuthentcatedRoutesGuard implements CanActivate {
    isUserAuthenticated = true;
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(): boolean | Promise<boolean> {
        if (!this.authService.isLoggedIn) {
            return this.router.navigate(['/login']);
        }
        return true;
    }
}

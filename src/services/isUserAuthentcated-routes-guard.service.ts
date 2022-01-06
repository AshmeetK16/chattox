// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable()
// export class isUserAuthentcatedRoutesGuard implements CanActivate {

//     constructor(
//         private router: Router
//     ) { }

//     canActivate(): boolean | Promise<boolean> {
//         return this.authService.getUserDataFromSession().then(userData => {
//             return this.authService.checkGigyaAndServerSession().then(() => {
//                 if (userData && userData.role) {
//                     switch (userData.role) {
//                         case 'student': this.appHelperService.navigateToDashboardLink(['learner', 'dashboard']); break;
//                         case 'teacher': this.appHelperService.navigateToDashboardLink(['teacher', 'dashboard']); break;
//                         case 'admin': this.appHelperService.navigateToAdminLink(['admin', 'dashboard']); break;
//                         default: this.appHelperService.navigateToOnboardingLink(['home']);
//                     }
//                     return true;
//                 } else {
//                     this.authService.rurl = window.location.pathname + window.location.search;
//                     this.authService.navigateToRurl();
//                 }
//             });
//         });
//     }
// }

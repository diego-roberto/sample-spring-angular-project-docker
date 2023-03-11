import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad } from '@angular/router';
import { SessionsService } from 'app/shared/services/sessions.service';
import { MdSnackBar } from '@angular/material';
import { PermissionService } from '../services/permission.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private sessionsService: SessionsService,
    public permissionService: PermissionService,
    private snackBar: MdSnackBar
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkIfCanActivate(route, state);

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.checkIfCanActivate(route, state);


  }

  canLoad(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.checkIfCanActivate(route, state);
  }


  checkIfCanActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.sessionsService.isLoggedIn()) {
      if (route.data && route.data.expectedPermissions) {
        if (route.data.paramCurrentConstruction) {
          let constructionId = parseInt(route.params[route.data.paramCurrentConstruction]);
          this.sessionsService.setCurrentConstruction(constructionId);
        }

        if (this.permissionService.hasSomePermission(route.data.expectedPermissions)) {
          return true;
        } else {
          this.snackBar.open('Sem permissão!', null, { duration: 3000 });
          this.router.navigate(['/login']);
        }
      } else {
        return true;
      }
    } else {
      this.sessionsService.triedRoute = state;
      if ('/' !== this.router.url) {
        this.snackBar.open('Sessão expirada!', null, { duration: 3000 });
      }

      this.router.navigate(['/login']);

    }


    return false;

  }


}

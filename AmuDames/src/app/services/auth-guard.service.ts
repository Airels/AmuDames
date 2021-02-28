import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../models/user.models';

@Injectable()
export class AuthGuard implements CanActivate {
    user!: User | null;

    constructor(public userService: UserService, private router: Router) {
        this.userService.userSubject.subscribe((user) => {
            this.user = user;
          });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(this.user != null && this.user != undefined) {
            alert('GUARD: connected');
            return true;
        } else {
            alert('GUARD: not connected');
            //this.router.navigate(['home']);
            return false;
        }
    }
}

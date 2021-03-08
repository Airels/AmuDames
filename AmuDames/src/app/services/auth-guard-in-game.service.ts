import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { GameManagerService } from './game-manager.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardInGame implements CanActivate {

    constructor(private gameManager: GameManagerService, private router: Router) {
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.gameManager.connected) {
            return confirm("Exiting this page meaning you will lose the game, do you wish to continue ?");
        }

        return true;
    }
}

import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { IssueZeroAppComponent, environment } from './app/';
import { APP_SHELL_RUNTIME_PROVIDERS } from '@angular/app-shell';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { FB_URL, IS_POST_LOGIN } from './app/shared/config';

if (environment.production) {
  enableProdMode();
}

// Checks if this is the OAuth redirect callback from Firebase
// Has to be global so can be used in CanActivate
(<any>window).__IS_POST_LOGIN = /\&__firebase_request_key/.test(window.location.hash);

bootstrap(IssueZeroAppComponent, [
  APP_SHELL_RUNTIME_PROVIDERS,
  FIREBASE_PROVIDERS,
  ROUTER_PROVIDERS,
  defaultFirebase(FB_URL),
  provide(IS_POST_LOGIN, {
    useValue: (<any>window).__IS_POST_LOGIN
  }),
]);

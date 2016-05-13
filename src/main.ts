import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { IssueZeroAppComponent, environment } from './app/';
import { APP_SHELL_RUNTIME_PROVIDERS } from '@angular/app-shell';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';

if (environment.production) {
  enableProdMode();
}

bootstrap(IssueZeroAppComponent, [
  APP_SHELL_RUNTIME_PROVIDERS,
  FIREBASE_PROVIDERS,
  defaultFirebase('https://issue-zero.firebaseio.com')
]);

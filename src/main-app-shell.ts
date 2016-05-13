import {provide} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {IssueZeroAppComponent} from './app/';
import {
  REQUEST_URL,
  ORIGIN_URL
} from 'angular2-universal';
import { APP_SHELL_BUILD_PROVIDERS } from '@angular/app-shell';
import { FIREBASE_PROVIDERS } from 'angularfire2';

export const options = {
  directives: [
    // The component that will become the main App Shell
    IssueZeroAppComponent
  ],
  platformProviders: [
    provide(ORIGIN_URL, {
      useValue: ''
    })
  ],
  providers: [
    APP_SHELL_BUILD_PROVIDERS,
    // What URL should Angular be treating the app as if navigating
    provide(APP_BASE_HREF, {useValue: '/'}),
    provide(REQUEST_URL, {useValue: '/'})
  ],
  async: true,
  preboot: false
};


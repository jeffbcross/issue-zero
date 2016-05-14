import {provide} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {IssueZeroAppComponent} from './app/';
import {
  REQUEST_URL,
  ORIGIN_URL,
  NODE_ROUTER_PROVIDERS,
  NODE_LOCATION_PROVIDERS
} from 'angular2-universal';
import { APP_SHELL_BUILD_PROVIDERS } from '@angular/app-shell';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';

import {FB_URL, IS_POST_LOGIN} from './app/shared/config';

export const options = {
  directives: [
    // The component that will become the main App Shell
    IssueZeroAppComponent
  ],
  platformProviders: [
    NODE_ROUTER_PROVIDERS,
    NODE_LOCATION_PROVIDERS,
    provide(ORIGIN_URL, {
      useValue: ''
    })
  ],
  providers: [
    APP_SHELL_BUILD_PROVIDERS,
    FIREBASE_PROVIDERS,
    defaultFirebase(FB_URL),
    provide(IS_POST_LOGIN, {
      useValue: false
    }),
    // What URL should Angular be treating the app as if navigating
    provide(APP_BASE_HREF, {useValue: '/'}),
    provide(REQUEST_URL, {useValue: '/'})
  ]
};


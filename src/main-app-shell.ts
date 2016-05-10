import {provide, NgZone} from '@angular/core';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {APP_BASE_HREF} from '@angular/common';
import {IssueCliApp} from './app/issue-cli';
import {REQUEST_URL, NODE_LOCATION_PROVIDERS, NODE_HTTP_PROVIDERS, ORIGIN_URL} from 'angular2-universal';

export const options = {
  directives: [
    // The component that will become the main App Shell
    IssueCliApp
  ],
  platformProviders: [
    provide(ORIGIN_URL, {
      useValue: ''
    }),
    // Providers from universal to make routing and http work in node
    NODE_LOCATION_PROVIDERS,
    NODE_HTTP_PROVIDERS,
    ROUTER_PROVIDERS
  ],
  providers: [
    // What URL should Angular be treating the app as if navigating
    provide(APP_BASE_HREF, {useValue: '/'}),
    provide(REQUEST_URL, {useValue: '/'})
  ],
  preboot: false
};

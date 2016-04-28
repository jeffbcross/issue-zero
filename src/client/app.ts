declare var preboot;
import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {FIREBASE_PROVIDERS, defaultFirebase, AuthMethods, AuthProviders, firebaseAuthConfig} from 'angularfire2';
import {provideDB, DBSchema} from '@ngrx/db';
import {provideStore, Store} from '@ngrx/store';

// Import auto-patching RxJS operators
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

import {IssueCliApp} from './app/issue-cli';
import {FB_URL, IS_PRERENDER, IS_POST_LOGIN, LOCAL_STORAGE} from './app/config';

import {Issue} from './app/github/types';

// Checks if this is the OAuth redirect callback from Firebase
// Has to be global so can be used in CanActivate
(<any>window).__IS_POST_LOGIN = /\&__firebase_request_key/.test(window.location.hash);

bootstrap(IssueCliApp, [
  FIREBASE_PROVIDERS, ROUTER_PROVIDERS, defaultFirebase(FB_URL),
  provide(IS_PRERENDER, {useValue: false}),
  provide(IS_POST_LOGIN, {
    useValue: (<any>window).__IS_POST_LOGIN
  }),
  provideDB({
    version: 1,
    name: 'issue-zero-app',
    stores: {
      'issues': {autoIncrement: true},
      'repos': {autoIncrement: true},
      'users': {autoIncrement: true}
    }
  }),
  provideStore({
    issues: (state:Issue[] = [], action) => {
      switch(action.type) {
        case 'addissuetoken':
          // state = state.concat();
          break;
      }
      return state;
    }
  }),
  provide(LOCAL_STORAGE, {
    useValue: (<any>window.localStorage)
  }),
  firebaseAuthConfig(
      {provider: AuthProviders.Github, method: AuthMethods.Redirect, scope: ['repo']}),
  HTTP_PROVIDERS
]).then(() => {
  if (typeof preboot !== 'undefined') preboot.complete();
  if (typeof performance !== 'undefined' && performance.timing &&
      performance.timing.navigationStart && performance.mark) {
    performance.mark('bootstrapped');
  }
});

/**
 * inject(store:Store<AppState>);
 * store.select('issues')
 * store.select(state => state.issues): Observable<Issue[]>
 *
 * Issues Service
 * class IssuesService {
 *   issues: Observable<Issue[]>;
 *   constructor(store:Store<AppState>) {
 *     this.issues = store.select('issues');
 *   }
 *
 *   closeIssue(issue:Issue) {
 *     http.doThing().do(res => {
 *       this.store.dispatch({
 *         type: 'CloseIssue',
 *         payload: issue,
 *         // reducer updates the state
 *       })
 *     })
 *   }
 * }
 *
 * db.changes.subscribe(store) //store is an observer
 *
 */
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide, Injectable, ReflectiveInjector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';
import { IssueZeroAppComponent, environment } from './app/';
import { APP_SHELL_RUNTIME_PROVIDERS } from '@angular/app-shell';
import {FIREBASE_PROVIDERS, defaultFirebase, AuthMethods, AuthProviders, firebaseAuthConfig} from 'angularfire2';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { GithubService } from './app/github.service';
import { ActionTypes, provideStore, Store } from '@ngrx/store';
import { Database, DBSchema, provideDB } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';

// Import auto-patching RxJS operators
import 'rxjs/add/observable/empty';
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
import 'rxjs/add/operator/merge';

// Just required so that `Hammer` gets added to global namespace
require('hammerjs');

import {
  AppState,
  filters,
  FB_URL,
  issues,
  Issue,
  IS_POST_LOGIN,
  labels,
  LOCAL_STORAGE,
  repos,
  users,
  selectedRepository,
  SELECTED_REPOSITORY_STORE_NAME
} from './app/shared';

if (environment.production) {
  enableProdMode();
}

const issueZeroStoreSchema = {
  repos,
  issues,
  labels,
  users,
  filters,
  selectedRepository
};

const issueZeroAppSchema: DBSchema = {
  version: 2,
  name: 'issue_zero_app',
  stores: {
    'appState': {primaryKey: 'id'},
    [SELECTED_REPOSITORY_STORE_NAME]: {autoIncrement: true}
  }
};

@Injectable()
export class StoreAutoCache {
  constructor(db: Database, store: Store<AppState>) {
    var openedDb = db.open('issue_zero_app');

    // db
    //   .do(() => console.log('database opened'))
    //   .flatMap(() => db.query('appState'))
    db.query('appState')
      .do((state: AppState) => {
      console.log('got appState');
      store.dispatch({
        type: ActionTypes.INIT,
        payload: state
      })
    })
    .do((state) => {
      console.log('state', state);
    }, () => {
      console.error('state error');
    }, () => {
      console.log('no query data');
    })
    .concat(store)
    .flatMap((state: AppState) => {
      console.log('updating appstate', state);
      // Setting an arbitrary id so data will be replaced instead of appended
      (<any>state).id = 0;
      let clonableState = [state].map((s: AppState) => {
        return Object.assign({}, s, {
          filters: Object
            .keys(state.filters)
            .reduce((prev, key: string) => {
              prev[key] = Object.assign({}, state.filters[key], {
                localStorage: undefined,
                changes: undefined
              })
              return prev;
            }, {})
        })
        // return Object.keys(s.filters.map((f: Filter) => {
        //   return
        // })
      })
      return db.insert('appState', clonableState);
    })
    .subscribe((state: AppState) => {

      console.log('updated appstate', state);
    })
  }
}


// Checks if this is the OAuth redirect callback from Firebase
// Has to be global so can be used in CanActivate
(<any>window).__IS_POST_LOGIN = /\&__firebase_request_key/.test(window.location.hash);

const injector = ReflectiveInjector.resolveAndCreate([
  provideDB(issueZeroAppSchema)
]);

var db = injector.get(Database);
var providers = [
  APP_SHELL_RUNTIME_PROVIDERS, FIREBASE_PROVIDERS, ROUTER_PROVIDERS, HTTP_PROVIDERS,
  defaultFirebase(FB_URL),
  provide(IS_POST_LOGIN, {
    useValue: (<any>window).__IS_POST_LOGIN
  }),
  GithubService,
  provideDB(issueZeroAppSchema),
  provide(LOCAL_STORAGE, {
    useValue: (<any>window.localStorage)
  }),
  firebaseAuthConfig(
      {provider: AuthProviders.Github, method: AuthMethods.Redirect, scope: ['repo']}),
  StoreAutoCache
];



db.query('appState')
  /**
   * Force onNext to be called, even if db.query completes
   * before any value has been emitted.
   **/
  .concat(Observable.of(null))
  .take(1)
  .subscribe((state: AppState) => {
    var args: any[] = [{repos, issues, labels, users, filters, selectedRepository}];
    if (state) args = args.concat([state]);
    bootstrap(IssueZeroAppComponent, providers.concat([
      provideStore.apply(null, args)
    ])).then(c => {
      // Force instantiation of StoreAutoCache
      // c.injector.get(StoreAutoCache);
    });
  });

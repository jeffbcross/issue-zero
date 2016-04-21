import {AngularFire} from 'angularfire2';
import {Inject, Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {_catch} from 'rxjs/operator/catch';
import {map} from 'rxjs/operator/map';
import {_do} from 'rxjs/operator/do';
import {mergeMap} from 'rxjs/operator/mergeMap';

import {User, Repo} from './types';
import {LOCAL_STORAGE} from '../config';

const GITHUB_API = 'https://api.github.com';

interface LocalStorage {
  getItem(key:string): string;
  setItem(key:string, value:string): void;
}

@Injectable()
export class Github {

  constructor(
    private _http:Http,
    @Inject(LOCAL_STORAGE) private _localStorage:LocalStorage,
    private _af:AngularFire) {}

  fetch(path:string, params?: string): Observable<Repo[]> {
    var accessToken = map.call(this._af.auth, (auth:FirebaseAuthData) => auth.github.accessToken);
    var httpReq = mergeMap.call(accessToken, (tokenValue) => this._httpRequest(path, tokenValue, params));
    return _catch.call(this._getCache(path), () => httpReq);
  }

  _httpRequest (path:string, accessToken:string, params?:string) {
    var url = `${GITHUB_API}${path}?${params ? params + '&' : ''}access_token=${accessToken}`
    var reqObservable = this._http.get(url);
    // Set the http response to cache
    // TODO(jeffbcross): issues should be cached in more structured and queryable format
    var setCacheSideEffect = _do.call(reqObservable, res => this._setCache(path, res.text()));
    // Get the JSON object from the response
    return map.call(setCacheSideEffect, res => res.json());
  }

  /**
   * TODO(jeffbcross): get rid of this for a more sophisticated, queryable cache
   */
  _getCache (path:string): Observable<Repo> {
    var cacheKey = `izCache${path}`;
    var cache = this._localStorage.getItem(cacheKey);
    if (cache) {
      return new ScalarObservable(JSON.parse(cache));
    } else {
      return ErrorObservable.create(null);
    }
  }

  /**
   * TODO(jeffbcross): get rid of this for a more sophisticated, queryable cache
   */
  _setCache(path:string, value:string): void {
    var cacheKey = `izCache${path}`;
    this._localStorage.setItem(cacheKey, value);
  }
}

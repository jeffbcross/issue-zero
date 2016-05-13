import {Component, Inject} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from '@angular/router-deprecated';
import {Location} from '@angular/common';
import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdButton} from '@angular2-material/button';
import {MdProgressCircle} from '@angular2-material/progress-circle';
import {Observable} from 'rxjs/Observable';
import {ArrayObservable} from 'rxjs/observable/ArrayObservable';
// import {Issues} from './issues/issues';
// import {Login} from './login/login';
// import { IS_POST_LOGIN } from './config';
// import {Github} from './github/github';
// import {Repo} from './github/types';
// import {RepoSelectorComponent} from './+repo-selector/index';
import { APP_SHELL_DIRECTIVES, IS_PRERENDER } from '@angular/app-shell';

console.log('AF', AngularFire)

@Component({
  moduleId: module.id,
  selector: 'issue-zero-app',
  styles: [`
md-toolbar button {
  color: white;
  background: transparent;
  outline: none;
  border: none;
}
md-sidenav-layout {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
md-sidenav {
  width: 200px;
  padding: 8px;
}

md-toolbar md-progress-circle[mode="indeterminate"] {
  width: 24px;
  height: 24px;
  margin: 0 6px;
}

md-toolbar md-progress-circle[mode="indeterminate"] /deep/ circle {
  stroke: white !important;
}

.indicator-container {
  height: 0;
  margin-top: 50%;
}

.indicator-container md-progress-circle {
  margin: -50px auto 0;
}
`],
  template: `
<md-sidenav-layout [ngClass]="{'preRendered': isPrerender}">
  <md-sidenav #sidenav>
    <div *shellNoRender>
      <md-card *ngIf="af.auth | async">
        <md-card-title-group>
          <img md-card-avatar [src]="(af.auth | async).github.profileImageURL + '&s=40'">
          <md-card-title>
            {{ (af.auth | async).github.displayName }}
          </md-card-title>
          <md-card-subtitle>
            @{{ (af.auth | async).github.username }}
          </md-card-subtitle>
        </md-card-title-group>
        <md-card-actions>
          <button md-button (click)="af.auth.logout(); sidenav.close()">
            Log out
          </button>
        </md-card-actions>
      </md-card>
      <md-card *ngIf="!(af.auth | async)">
        <md-card-title-group>
          <md-card-title>
            Not Logged In
          </md-card-title>
        </md-card-title-group>
        <md-card-actions>
          <button md-button (click)="af.auth.login()">
            Log in
          </button>
        </md-card-actions>
      </md-card>
    </div>
  </md-sidenav>
  <md-toolbar color="primary">
    <md-progress-circle mode="indeterminate" *shellRender></md-progress-circle>
    <button *shellNoRender (click)="sidenav.open()"><i class="material-icons">menu</i></button>

    <span>Issue Zero</span>
  </md-toolbar>
  <div class="indicator-container" *shellRender>
    <md-progress-circle mode="indeterminate"></md-progress-circle>
  </div>

  <router-outlet *shellNoRender></router-outlet>
</md-sidenav-layout>
`,
  directives: [
    // ROUTER_DIRECTIVES,
    MdToolbar, MD_CARD_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MdButton,
    MdProgressCircle, APP_SHELL_DIRECTIVES
  ],
  pipes: [],
  providers: []
})
export class IssueZeroAppComponent {
  title = 'issue-zero works!';
  // af: AngularFire;
  constructor() {
    //@Inject(AngularFire) af: AngularFire
        // this.af = af;
        // router: Router,
      // gh: Github,
      // @Inject(IS_PRERENDER) public isPrerender: boolean
      // , @Inject(IS_POST_LOGIN) isPostLogin:boolean,
      // location:Location
      }
}

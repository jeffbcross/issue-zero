import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdButton} from '@angular2-material/button';

import {IssuesComponent} from './issues/issues';

@Component({
  selector : 'issue-zero-app',
  styles : [ `
    md-toolbar button {
      color: white;
      background: transparent;
      outline: none;
      border: none;
    }
  ` ],
  template : `
    <md-sidenav-layout>
      <md-sidenav #start (open)="mybutton.focus()">
        <h1>Setting</h1>
      </md-sidenav>
      <md-toolbar color="primary">
        <!-- todo(jeffbcross): switch to md-icon-button on next material release -->
        <button (click)="start.open()">
          <i class="material-icons">menu</i>
        </button>
        <span>Issue Zero</span>
      </md-toolbar>
      <router-outlet></router-outlet>
    </md-sidenav-layout>
  `,
  directives :
      [ ROUTER_DIRECTIVES, MdToolbar, MD_SIDENAV_DIRECTIVES, MdButton ],
  providers : []
})
@RouteConfig(
    [ {path : 'issues/...', component : IssuesComponent, useAsDefault : true} ])
export class AppComponent {
}

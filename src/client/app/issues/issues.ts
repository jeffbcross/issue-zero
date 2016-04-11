import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {List} from './list/list';

@Component({
  template: `
  Hi
  <router-outlet></router-outlet>`,
  providers: [],
  directives: [RouterOutlet]
})
@RouteConfig([
  {path: '/list/...', name: 'List', component: List, useAsDefault: true},
])
export class Issues {
  constructor() {}
}

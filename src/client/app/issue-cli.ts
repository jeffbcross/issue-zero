import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {Issues} from './issues/issues';
import {Login} from './login/login';

@Component({
  selector: 'issue-cli-app',
  providers: [ROUTER_PROVIDERS],
  templateUrl: 'app/issue-cli.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([
  {path: '/issues/...', name: 'Issues', component: Issues},
  {path: '/login/...', name: 'Login', component: Login},
])
export class IssueCliApp {
  defaultMeaning: number = 42;

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}

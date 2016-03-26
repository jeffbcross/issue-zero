import {Component} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {MdToolbar} from '@angular2-material/toolbar';

@Component({
  templateUrl : 'app/issues/close/close.html',
  directives : [ ROUTER_DIRECTIVES, MdToolbar ]
})
export class CloseComponent {
  id: string;
  constructor(params: RouteParams) { this.id = params.get('id'); }
}

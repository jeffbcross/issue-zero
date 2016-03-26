import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdAnchor} from '@angular2-material/button';
import {Observable} from 'rxjs/Observable';

import {Issue, IssuesService} from '../shared/issues-service/issues-service';

@Component({
  templateUrl : 'app/issues/list/list.html',
  directives : [ MD_CARD_DIRECTIVES, ROUTER_DIRECTIVES, MdAnchor ],
  providers : [ IssuesService ],
  styles : [ `
  .container {
    display: flex;
    flex-flow: row wrap;

  }
  md-card {
    width: 350px;
    margin: 5px;
  }` ]
})
export class ListComponent {
  issues: Observable<Issue[]>;
  constructor(issues: IssuesService) { this.issues = issues.query(); }
}

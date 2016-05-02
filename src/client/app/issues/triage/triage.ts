import {Component} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {MdButton} from '@angular2-material/button';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdCheckbox} from '@angular2-material/checkbox';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import {Github} from '../../github/github';
import {Issue, Label} from '../../github/types';
import {RepoParams} from '../../repo-params/repo-params';
import {AppState} from '../../store/store';

@Component({
  template: `
    <button md-icon-button [routerLink]="['/Issues', {org: org, repo: repo}, 'List']">
      <i class="material-icons">arrow_back</i>
    </button>
    Issue {{issue?.number}}
    <form>
      <h3>Labels</h3>
      <md-list dense>
        <md-list-item *ngFor="#label of labels | async">
          <md-checkbox [checked]="isChecked(label)">
            {{label.name}}
          </md-checkbox>
        </md-list-item>
      </md-list>
      <button md-button>
        Update
      </button>
    </form>
  `,
  providers: [RepoParams],
  directives: [MD_LIST_DIRECTIVES, MdButton, MdCheckbox, ROUTER_DIRECTIVES]
})
export class Triage {
  org: string;
  repo: string;
  labels: Observable<Label[]>;
  issue: Issue;
  constructor(
    private repoParams: RepoParams,
    private gh: Github,
    private store: Store<AppState>,
    routeParams:RouteParams) {
    var {org, repo} = repoParams.getRepo();
    this.org = org;
    this.repo = repo;
    this.labels = gh.fetchLabels(`${org}/${repo}`);
    this.store.select('issues')
      .filter((i:Issue[]) => !!i)
      .do((state) => {
        console.log('state', state)
      })
      .map((issues:Issue[]) => issues
        .filter((issue:Issue) => {
          console.log('filtering', issue);
          return issue.org === org && issue.repo === repo && issue.number === parseInt(routeParams.get('id'), 10)
        })[0]
      )
      .subscribe((issue:Issue) => {
        this.issue = issue;
      });
    this.gh.getIssue(org, repo, routeParams.get('id'))
      .subscribe((issue:Issue) => {
        this.store.dispatch({
          type: 'AddIssues',
          payload: [issue]
        });
      });
  }

  isChecked(label: Label): boolean {
    this.issue.labels.filter(l => {
      console.log('l.name', l.name, 'label.name', label.name)
      return l.name === label.name
    })
    return this.issue ? this.issue.labels.filter(l => l.name === label.name).length === 1 : false;
  }
}

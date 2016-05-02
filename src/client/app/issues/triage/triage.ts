import {Component, Pipe} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {MdButton} from '@angular2-material/button';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdCheckbox} from '@angular2-material/checkbox';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import {Github} from '../../github/github';
import {Issue, Label} from '../../github/types';
import {RepoParams} from '../../repo-params/repo-params';
import {AppState} from '../../store/store';

@Pipe({
  name: 'isChecked'
})
class IsChecked {
  transform (label: Label, [issue]: [Issue]): boolean {
    return issue ? issue.labels.filter(l => l.name === label.name).length === 1 : false;
  }
}

@Pipe({
  name: 'toDate'
})
class ToDate {
  transform(date:string): Date {
    return new Date(date);
  }
}

@Component({
  template: `
    <md-toolbar>
      <button md-icon-button [routerLink]="['/Issues', {org: org, repo: repo}, 'List']">
        <i class="material-icons">arrow_back</i>
      </button>
      {{issue?.title}}
      <span class="issue-number">
        #{{issue?.number}}
      </span>
    </md-toolbar>
    <div *ngIf="issue" class="view-container">
      <p class="user-and-date">
        @{{issue.user.login}} on {{issue.created_at | toDate | date}}:
      </p>
      <p class="description">
        {{issue?.body}}
      </p>
      <form>
        <h3>Labels</h3>
        <md-list dense>
          <md-list-item *ngFor="#label of labels | async">
            <md-checkbox (change)="labelChanged(label, $event)" [checked]="label | isChecked:issue">
              {{label.name}}
            </md-checkbox>
          </md-list-item>
        </md-list>
        <button md-button (click)="updateIssue()">
          Save
        </button>
        <button md-button color="warn" [routerLink]="['/Issues', {org: org, repo: repo}, 'List']">
          Cancel
        </button>
      </form>
    </div>
  `,
  styles: [`
    .description {
      font-size: 1.2em;
    }
    .view-container {
      margin: 16px;
    }
    .issue-number {
      color: rgba(0,0,0,0.54);
    }
    .user-and-date {
      color: rgba(0,0,0,0.54);
    }
  `],
  providers: [RepoParams],
  directives: [MD_LIST_DIRECTIVES, MdButton, MdCheckbox, ROUTER_DIRECTIVES, MdToolbar],
  pipes: [IsChecked, ToDate]
})
export class Triage {
  org: string;
  repo: string;
  labels: Observable<Label[]>;
  issue: Issue;
  labelsToApply: {[key:string]: boolean} = {};
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
          return issue.org === org && issue.repo === repo && issue.number === parseInt(routeParams.get('number'), 10)
        })[0]
      )
      .subscribe((issue:Issue) => {
        this.issue = issue;
      });
    this.gh.getIssue(org, repo, routeParams.get('number'))
      .subscribe((issue:Issue) => {
        this.store.dispatch({
          type: 'AddIssues',
          payload: [issue]
        });
      });
  }

  updateIssue() {
    console.log(this.labelsToApply);
    var patch = {
      labels: Object.keys(this.labelsToApply)
    };

    this.gh.patchIssue(this.org, this.repo, this.issue.number, patch)
      .subscribe()
  }

  labelChanged (label: Label, value: boolean) {
    if (value) {
      this.labelsToApply[label.name] = value;
    } else {
      delete this.labelsToApply[label.name];
    }
  }
}

import {Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { ROUTER_DIRECTIVES, RouteParams } from '@angular/router-deprecated';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdToolbar} from '@angular2-material/toolbar';
import {Observable} from 'rxjs/Observable';

import {RepoSelectorRowComponent} from './repo-selector-row/repo-selector-row.component';
import {GithubService} from '../github.service';
import {Repo} from '../shared/types';

@Component({
  selector: 'repo-selector',
  template: `
    <md-toolbar color="accent">
      <button [routerLink]="['/Issues', {repo: routeParams.get('repo'), org: routeParams.get('org')}]">
        <span class="material-icons back-btn">arrow_back</span>
      </button>
      <span>
        Select Repository
      </span>
    </md-toolbar>
    <md-list>
      <repo-selector-row
        [repo]="repo"
        *ngFor="#repo of repos | async"
        [routerLink]="['/Issues', {org: repo.owner.login, repo: repo.name}]">
      </repo-selector-row>
    </md-list>
  `,
  styles: [`
    md-toolbar button {
      color: white;
      background: transparent;
      outline: none;
      border: none;
    }
  `],
  directives: [MD_LIST_DIRECTIVES, MdToolbar, RepoSelectorRowComponent, ROUTER_DIRECTIVES],
  providers: [GithubService]
})
export class RepoSelectorComponent implements OnInit {
  repos:Observable<Repo[]>;
  constructor(private gh:GithubService, private routeParams:RouteParams) {}

  ngOnInit() {
    this.repos = this.gh.fetch(`/user/repos`, 'affiliation=owner,collaborator&sort=updated');
  }
}

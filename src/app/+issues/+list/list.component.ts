import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {Store} from '@ngrx/store';

import {ToolbarComponent} from './toolbar/toolbar.component';
import {IssueRowComponent} from './issue-row/issue-row.component';
import {
  AppState,
  GITHUB_STORE_ACTION_TYPES,
  GithubDataNeededAction,
  GithubDataNeededState,
  Issue,
  Repo,
  SELECTED_REPOSITORY_STORE_NAME,
  SELECTED_REPOSITORY_ACTION_TYPES
} from '../../shared';
import {GithubService} from '../../github.service';
import {
  Filter,
  FilterObject,
  FilterMap,
  generateQuery
} from '../../filter-store.service';
import {RepoParamsService} from '../../repo-params.service';
import {NotPendingRemoval} from './not-pending-removal.pipe';

@Component({
  styles: [`
    md-list-item {
      background-color: rgb(245, 245, 245)
    }
  `],
  template: `
    <issue-list-toolbar
      [repo]="repoSelection | async">
    </issue-list-toolbar>

    <md-list>
      <issue-row
        *ngFor="let issue of issues | async | notPendingRemoval"
        [ngForTrackBy]="'url'"
        [issue]="issue"
        (close)="closeIssue(issue)"
        (triage)="triageIssue(issue)"
        [routerLink]="['../Triage', {number: issue.number}]">
      </issue-row>
    </md-list>
  `,
  providers: [GithubService, RepoParamsService],
  directives: [MD_LIST_DIRECTIVES, ToolbarComponent, IssueRowComponent, ROUTER_DIRECTIVES],
  pipes: [NotPendingRemoval],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  issues: Observable<Issue[]>;
  repos: Observable<Repo[]>;
  repoSelection: Observable<Repo>;
  addIssueSubscription: Subscription;
  constructor(
      private gh: GithubService,
      private store: Store<AppState>, private repoParams: RepoParamsService,
      private router: Router) {}

  ngOnInit() {
    var {repo, org} = this.repoParams.getRepo();

    /**
     * Get full repo object based on route params.
     */
    this.repoSelection = <Observable<Repo>>this.store.select(SELECTED_REPOSITORY_STORE_NAME)
      /**
       * If this route is loaded directly, there may not be
       * a selectedRepo in the store yet. Since we have the state
       * in the route, let's populate the store.
       * TODO: centralize the management of this.
       */
      .do((r: {org: string, repo: string}) => {
        console.log('r?', r);
        if (!r) this.store.dispatch({
            type: SELECTED_REPOSITORY_ACTION_TYPES.Selected,
            payload: { org, repo }
          })
      })
      /**
       * Now get the repository information from the store.
       */
      .switchMap(({org, repo}: {org?: string, repo?: string} = {}) => this.store.select('repos')
          .do((repos: Repo[]) => {
            // If no repos match the active filter
            if (!repos.length || !repos.filter((repository: Repo) => repository.name === repo && repository.owner.login === org).length) {
              var action: GithubDataNeededAction = {
                type: GITHUB_STORE_ACTION_TYPES.GetRepo,
                payload: {
                  org,
                  repo,
                  method: 'getRepo'
                }
              };
              this.store.dispatch(action)
            }
          })
          .filter((r: Repo[]) => !!r)
          .map((repos: Repo[]) => repos.filter((repository: Repo) => {
            return repository.name === repo && repository.owner.login === org;
          })[0]));

    /**
     * Fetch the issues for this repo.
     */
    this.addIssueSubscription =
        this.store.select('filters')
            .map((filters: FilterMap) => filters && filters[`${org}/${repo}`])
            /**
             * If there's not already a filter set for this repo, create one.
             */
            .do((f: Filter) => {
              if (!f) this.store.dispatch({
                type: 'CreateFilterIfNotExist',
                payload: { org, repo }
              });
            })
            .filter((filter: Filter) => !!filter)
            .map((filter: FilterObject) => generateQuery(filter))
            .switchMap((query: string) => this.gh.getIssues(query))
            .subscribe(
                (issues: Issue[]) => {this.store.dispatch({type: 'AddIssues', payload: issues});});

    // this.store.dispatch({type: 'SetFilter', payload: this.filterStore.getFilter(`${org}/${repo}`)});

    this.issues = this.store.select('issues')
                      .filter((i: Issue[]) => !!i)
                      .map(
                          (issues: Issue[]) => issues.filter(
                              (issue: Issue) => {return issue.org === org && issue.repo === repo;}));
  }

  getSmallAvatar(repo: Repo): string { return repo ? `${repo.owner.avatar_url}&s=40` : ''; }

  ngOnDestroy() {
    if (this.addIssueSubscription) {
      this.addIssueSubscription.unsubscribe();
    }
  }

  closeIssue(issue: Issue): void {
    // Set the issue as pending removal
    this.store.dispatch({type: 'PendingRemoveIssue', payload: issue});
    this.gh.closeIssue(issue).take(1).subscribe(
        () => { this.store.dispatch({type: 'RemoveIssue', payload: issue}); });
  }

  triageIssue(issue: Issue) { this.router.navigate(['../Triage', {number: issue.number}]); }
}

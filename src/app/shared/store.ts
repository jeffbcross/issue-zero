import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Issue, Repo, Label, User } from './types';
import { FilterMap, Filter } from '../filter-store.service';

export function issues (state: Issue[] = [], action:Action): Issue[] {
  switch (action.type) {
    case 'AddIssues':
      state = addIssues(action, state);
      break;
    case 'RemoveIssue':
      state = state.filter((issue:Issue) => {
        return issue.id !== action.payload.id;
      });
      break;
    case 'PendingRemoveIssue':
      state = state
        .map((issue:Issue) => {
          if (issue.id === action.payload.id) {
            return Object.assign({}, issue, {
              isPendingRemoval: true
            })
          }
          return issue;
        })
      break;
  }
  return state;
}

// Creates keys of org:repo:number to quickly filter against.
function getIssueUnique(issue:Issue): string {
  return `${issue.org}:${issue.repo}:${issue.number}`;
}

function addIssues(action:Action, state:Issue[]) {
  /**
   * Make sure no duplicate issues, newest issues win.
   **/
  var existingKeys = action.payload.reduce((prev, curr) => {
    prev[curr.id] = true;
    return prev;
  }, {});
  state = action.payload.concat(state.filter((issue:Issue) => {
    // Only return issues that aren't in the new payload.
    return !existingKeys[issue.id];
  }));
  return state;
}

export function repos(state: Repo[] = [], action:Action): Repo[] {
  switch(action.type) {
    case 'AddRepo':
      state = state.concat(action.payload);
      break;
  }
  return state;
}

export function users(state: User[] = [], action:Action): User[] {
  return state;
}

export function labels(state: Label[] = [], action:Action): Label[] {
  return state;
}

export function selectedRepository (state: Repo, action: Action): Repo {
  switch (action.type) {
    case 'RepositorySelected':
      console.log('repository selected!', action.payload);
      state = action.payload;
      break;
  }
  return state;
}

export function filters(state: FilterMap = {}, action:Action): FilterMap {
  var key;
  if (action && action.payload && action.payload.org && action.payload.repo) {
    key = `${action.payload.org}/${action.payload.repo}`;
  }
  console.log('action', action);
  switch(action.type) {
    case 'CreateFilterIfNotExist':
      if (!state[key]) {
        state = Object.assign({}, state, {
          [key]: new Filter(key)
        });
      }
      break;
    case 'SetFilter':
      state = Object.assign({}, state, {
        [key]: action.payload
      });
      break;

    case 'UpdateFilterCriteria':
      state = Object.assign({}, state, {
        [key]: Object.assign({}, state[key], {
          criteria: state[key].criteria.map((c, i: number) => {
            return i === action.payload.index ? action.payload.newCriteria : c;
          })
        })
      })
      console.log('UpdateFilterCriteria', state);
      break;
    case 'RemoveFilterCriteria':
      state = Object.assign({}, state, {
        [key]: Object.assign({}, state[key], {
          criteria: state[key].criteria.filter((c, i: number) => {
            return i !== action.payload.index;
          })
        })
      })
      console.log('UpdateFilterCriteria', state);
      break;
    case 'AddFilterCriteria':
      let newCriteria = state[key].criteria.concat(action.payload.criteria)
      state = Object.assign({}, state, {
        [key]: Object.assign({}, state[key], {criteria: newCriteria})
      });
      break;
  }
  return state;
}

export interface AppState {
  issues: Issue[];
  labels: Label[];
  users: User[];
  repos: Repo[];
  filters: FilterMap;
  selectedRepository: Repo;
}

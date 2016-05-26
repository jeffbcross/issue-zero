import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Operator} from 'rxjs/Operator';
import { Store } from '@ngrx/store';

import { AppState, LOCAL_STORAGE } from './shared';

export const LOCAL_STORAGE_KEY = 'FilterStore.filters';

export interface FilterMap {
  [key:string]: Filter;
}


@Injectable()
export class FilterStoreService {
private _filters = new Map<string, Filter>();
  constructor(@Inject(LOCAL_STORAGE) private localStorage:any, private _store: Store<AppState>) {}

  getFilter (repository:string): Observable<Filter> {
    return this._store
      .select('filters')
      .map((filters: FilterMap) => {
        return filters[repository] || new Filter(repository);
      })
    }
  }
}

export class Filter {
  org: string;
  repo: string;
  constructor(
    repo?:string,
    public criteria: Criteria[] = [UnlabeledCriteria]) {
    var split = repo.split('/');
    this.org = split[0];
    this.repo = split[1];
  }

  addCriteria(c:Criteria): void {
    // var initialValue = this.changes.value;
    // var newValue = {
    //   repo: initialValue.repo,
    //   criteria: initialValue.criteria.concat([c])
    // };
    // switch(c.type) {
    //   case 'unlabeled':
    //     newValue.criteria = removeHasLabelCriteria(newValue.criteria);
    //     break;
    //   case 'hasLabel':
    //     newValue.criteria = removeNoLabelIfHasLabel(newValue.criteria);
    //     break;
    // }
    // this._cacheAndEmit(newValue);
  }

  removeCriteria(index:number): void {
    // var initialValue = this.changes.value;
    // var newValue = {
    //   repo: initialValue.repo,
    //   criteria: initialValue.criteria.reduce((prev:Criteria[], curr:Criteria, i) => {
    //       if (i === index) return prev;
    //       return prev.concat([curr]);
    //     }, [])
    // };
    // this._cacheAndEmit(newValue);
  }

  _cacheAndEmit(newValue:FilterObject): void {
    // updateCache(newValue.repo, newValue, this.localStorage);
    // this.changes.next(newValue);
  }

  static fromJson (storage:any, json:FilterObject):Filter {
    // return new Filter(storage, json.repo, json.criteria);
    return;
  }
}

/**
 * Prevents the presence of a hasLabel and unlabeled type of criteria,
 * which are incompatible.
 */
export function removeNoLabelIfHasLabel(criteria:Criteria[]): Criteria[] {
  var hasLabelInList = !!criteria.filter((c:Criteria) => c.type === 'hasLabel').length;
  // No hasLabel type in list, return as-is.
  if (!hasLabelInList) return criteria;
  if (hasLabelInList) {
    return criteria.reduce((prev, curr:Criteria) => {
      if (curr.type === 'unlabeled') return prev;
      prev.push(curr)
      return prev;
    }, []);
  }
}

export function removeHasLabelCriteria(criteria: Criteria[]): Criteria[] {
  var hasUnlabeledInList = !!criteria.filter((c:Criteria) => c.type === 'unlabeled').length;
  // No hasLabel type in list, return as-is.
  if (!hasUnlabeledInList) return criteria;
  if (hasUnlabeledInList) {
    return criteria.reduce((prev, curr:Criteria) => {
      if (curr.type === 'hasLabel') return prev;
      prev.push(curr)
      return prev;
    }, []);
  }
}

export function generateQuery (filter:FilterObject): string {
  var generated = `${filter.criteria
    .map(c => {
      var interpolated = c.query;
      if ((<LabelCriteria>c).label) {
        let label = (<LabelCriteria>c).label;
        // Replace spaces with pluses to make Github API happy
        label = label.replace(/ /g, '+')
        // Wrap in quotes for more complex labels
        label = `"${label}"`
        interpolated = c.query.replace('%s', label)
      }

      // URI encode it
      interpolated = encodeURI(interpolated);
      // Unescape quotes
      return interpolated.replace(/%22/g, '"');
    })
    .join('+')}+repo:${filter.repo}+state:open`
  return generated;
}

export interface FilterObject {
  criteria: Criteria[];
  repo: string;
}

export interface Criteria {
  type: string;
  name: string;
  query: string;
}

export interface LabelCriteria extends Criteria {
  label?: string;
}

export const UnlabeledCriteria:Criteria = {
  type: 'unlabeled',
  name: 'Has NO label',
  query: 'no:label'
};

export const LabelCriteria = {
  type: 'hasLabel',
  name: 'Has label',
  query: 'label:%s'
}

export interface FilterCriteriaUpdate {
  type: 'UpdateFilterCriteria';
  payload: {
    repo: string;
    org: string;
    index: number;
    newCriteria: Criteria | LabelCriteria
  };
}
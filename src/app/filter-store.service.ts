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
  console.log('filterObject', filter);
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
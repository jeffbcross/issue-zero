import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/take';

@Injectable()
export class IssuesService {
  query(): Observable<Issue[]> {
    return Observable
        .create((observer: Observer<Issue[]>) => { observer.next(issues); })
        .take(1);
  }
}

var issues: Issue[] = [
  {
    id : 0,
    title : 'issue title',
    avatar : 'https://avatars2.githubusercontent.com/u/139426?v=3&s=40',
    description : 'sdescsdf',
    numComments : 5,
    organization : 'angular',
    repository : 'angular',
    author : 'jeffbcross'
  },
  {
    id : 1,
    title : 'issue title',
    avatar : 'https://avatars2.githubusercontent.com/u/139426?v=3&s=40',
    description : 'sdescsdf',
    numComments : 5,
    organization : 'angular',
    repository : 'angular',
    author : 'jeffbcross'
  },
  {
    id : 2,
    title : 'issue title',
    avatar : 'https://avatars2.githubusercontent.com/u/139426?v=3&s=40',
    description : 'sdescsdf',
    numComments : 5,
    organization : 'angular',
    repository : 'angular',
    author : 'jeffbcross'
  },
  {
    id : 3,
    title : 'issue title',
    avatar : 'https://avatars2.githubusercontent.com/u/139426?v=3&s=40',
    description : 'sdescsdf',
    numComments : 5,
    organization : 'angular',
    repository : 'angular',
    author : 'jeffbcross'
  },
  {
    id : 4,
    title : 'issue title',
    avatar : 'https://avatars2.githubusercontent.com/u/139426?v=3&s=40',
    description : 'sdescsdf',
    numComments : 5,
    organization : 'angular',
    repository : 'angular',
    author : 'jeffbcross'
  },
  {
    id : 5,
    title : 'issue title',
    avatar : 'https://avatars2.githubusercontent.com/u/139426?v=3&s=40',
    description : 'sdescsdf',
    numComments : 5,
    organization : 'angular',
    repository : 'angular',
    author : 'jeffbcross'
  },
  {
    id : 6,
    title : 'issue title',
    avatar : 'https://avatars2.githubusercontent.com/u/139426?v=3&s=40',
    description : 'sdescsdf',
    numComments : 5,
    organization : 'angular',
    repository : 'angular',
    author : 'jeffbcross'
  }
];

export interface Issue {
  id: number;
  title: string;
  avatar: string;
  description: string;
  numComments: number;
  organization: string;
  repository: string;
  author: string;
}
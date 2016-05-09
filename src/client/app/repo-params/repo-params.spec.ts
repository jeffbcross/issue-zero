import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from '@angular/core';
import {RepoParams} from './repo-params';


describe('RepoParams Service', () => {

  beforeEachProviders(() => [RepoParams]);


  it('should ...', inject([RepoParams], (service: RepoParams) => {

  }));

});

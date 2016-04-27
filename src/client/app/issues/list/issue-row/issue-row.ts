import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from 'angular2/core';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {Github} from '../../../github/github';

declare var Hammer;

@Component({
  selector: 'issue-row',
  template: `
    <div class="hidden hidden-triage"></div>
    <div class="hidden hidden-close"></div>
    <md-list-item (touchmove)="onTouchMove($event)" (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
      <img md-list-avatar [src]="issue.user.avatar_url + '&s=40'" alt="{{issue.user.login}} logo">
      <span md-line> {{issue.title}} </span>
      <p md-line class="secondary">
        @{{issue.user.login}}
        -
        {{issue.body}}
      </p>
    <md-list-item>
  `,
  styles: [`
    [md-line].secondary {
      color: rgba(0,0,0,0.54);
    }

    .hidden {
      height: 72px;
      width: 0;
    }

    .hidden-triage {
      float:left;
      background: #090;
    }

    .hidden-close {
      background: #c00;
      float: right;
    }
  `],
  providers: [Github],
  directives: [MD_LIST_DIRECTIVES],
  pipes: []
})
export class IssueRow implements AfterViewInit {
  @Input('issue') issue:any;
  touchStartCoords: {x:number, y:number};
  listItemNativeEl:HTMLElement;
  triageNativeEl:HTMLElement;
  closeNativeEl:HTMLElement;

  constructor(public el:ElementRef, public gh:Github) {}

  onTouchStart (evt) {
    this.listItemNativeEl.style.position = 'relative';
    this.listItemNativeEl.style.display = 'block';
    this.listItemNativeEl.style.left = '0';
    var coords = evt.targetTouches[0]
    this.touchStartCoords = {
      x: coords.clientX,
      y: coords.clientY
    }
  }

  onTouchMove (evt) {
    var {clientX, clientY} = evt.targetTouches[0];
    var left = clientX - this.touchStartCoords.x;


    if (left > 0) {
      this.closeNativeEl.style.width = '0';
      this.triageNativeEl.style.width = `${left}px`;
      this.listItemNativeEl.style.left = '0';
    } else {
      this.triageNativeEl.style.width = '0';
      this.listItemNativeEl.style.left = `${left}px`;
      this.closeNativeEl.style.width = `${Math.abs(left)}px`
    }
  }

  onTouchEnd (evt) {
    this.listItemNativeEl.style.position = '';
    this.listItemNativeEl.style.display = 'block';
    this.listItemNativeEl.style.left = '0';
    this.closeNativeEl.style.width = '0';
    this.triageNativeEl.style.width = '0';
  }

  ngAfterViewInit () {
    this.listItemNativeEl = this.el.nativeElement.querySelector('md-list-item');
    this.triageNativeEl = this.el.nativeElement.querySelector('.hidden-triage');
    this.closeNativeEl = this.el.nativeElement.querySelector('.hidden-close');
    var hammerEl = new Hammer(this.listItemNativeEl);
    hammerEl.on('swiperight', () => {
      this.gh.closeIssue(this.issue).subscribe(() => {});
    });

    hammerEl.on('swipeleft', () => {
      console.log('swipeleft');
    });
  }
}

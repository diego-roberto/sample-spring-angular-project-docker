import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  AfterContentInit,
  ElementRef,
  Renderer,
  Inject,
  forwardRef,
  ContentChildren,
  QueryList,
  ContentChild,
  HostBinding,
  HostListener
} from '@angular/core';
import { MdButton } from '@angular/material';

const Z_INDEX_ITEM = 23;

@Component({
  selector: 'fab-trigger',
  template: `
        <ng-content select="[md-fab], [mat-fab]"></ng-content>
    `
})
export class FabSpeedDialTriggerComponent {

  @HostBinding('class.spin') get sp() { return this.spin; };
  @Input() spin = false;

  constructor(@Inject(forwardRef(() => FabSpeedDialComponent)) private _parent: FabSpeedDialComponent) {
  }

  @HostListener('click', ['$event'])
  _onClick(event: any) {
    if (!this._parent.fixed) {
      this._parent.toggle();
      event.stopPropagation();
    }
  }

}

@Component({
  selector: 'fab-actions',
  template: `
        <ng-content select="[md-mini-fab], [mat-mini-fab]"></ng-content>
    `
})
export class FabSpeedDialActionsComponent implements AfterContentInit {

  @ContentChildren(MdButton) _buttons: QueryList<MdButton>;

  constructor(@Inject(forwardRef(() => FabSpeedDialComponent)) private _parent: FabSpeedDialComponent, private renderer: Renderer) {
  }

  ngAfterContentInit(): void {
    this._buttons.changes.subscribe(() => {
      this.initButtonStates();
      this._parent.setActionsVisibility();
    });

    this.initButtonStates();
  }

  private initButtonStates() {
    this._buttons.toArray().forEach((button, i) => {
      this.renderer.setElementClass(button._getHostElement(), 'fab-action-item', true);
      this.changeElementStyle(button._getHostElement(), 'z-index', '' + (Z_INDEX_ITEM - i));
    });
  }

  show() {
    if (this._buttons) {
      this._buttons.toArray().forEach((button, i) => {
        let transitionDelay = 0;
        let transform;
        if (this._parent.animationMode === 'scale') {
          transitionDelay = 3 + (65 * i);
          transform = 'scale(1)';
        } else {
          transform = this.getTranslateFunction('0');
        }
        this.changeElementStyle(button._getHostElement(), 'transition-delay', transitionDelay + 'ms');
        this.changeElementStyle(button._getHostElement(), 'opacity', '1');
        this.changeElementStyle(button._getHostElement(), 'transform', transform);
      });
    }
  }

  hide() {
    if (this._buttons) {
      this._buttons.toArray().forEach((button, i) => {
        let opacity = '1';
        let transitionDelay = 0;
        let transform;
        if (this._parent.animationMode === 'scale') {
          transitionDelay = 3 - (65 * i);
          transform = 'scale(0)';
          opacity = '0';
        } else {
          transform = this.getTranslateFunction((55 * (i + 1) - (i * 5)) + 'px');
        }
        this.changeElementStyle(button._getHostElement(), 'transition-delay', transitionDelay + 'ms');
        this.changeElementStyle(button._getHostElement(), 'opacity', opacity);
        this.changeElementStyle(button._getHostElement(), 'transform', transform);
      });
    }
  }

  private getTranslateFunction(value: string) {
    const dir = this._parent.direction;
    const translateFn = (dir === 'up' || dir === 'down') ? 'translateY' : 'translateX';
    const sign = (dir === 'down' || dir === 'right') ? '-' : '';
    return translateFn + '(' + sign + value + ')';
  }

  private changeElementStyle(elem: any, style: string, value: string) {
    this.renderer.setElementStyle(elem, style, value);
  }
}

@Component({
  selector: 'fab-speed-dial',
  template: `
        <div class="fab-speed-dial-container">
            <ng-content select="fab-trigger"></ng-content>
            <ng-content select="fab-actions"></ng-content>
        </div>
    `,
  styleUrls: ['fab-speed-dial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FabSpeedDialComponent implements AfterContentInit {
  private isInitialized = false;
  private _direction = 'up';
  private _open = false;
  private _animationMode = 'fling';

  @Input() fixed = false;

  @HostBinding('class.opened')
  @Input() get open() {
    return this._open;
  }

  set open(open: boolean) {
    const previousOpen = this._open;
    this._open = open;
    if (previousOpen !== this._open) {
      this.openChange.emit(this._open);
      if (this.isInitialized) {
        this.setActionsVisibility();
      }
    }
  }

  @Input() get direction() {
    return this._direction;
  }

  set direction(direction: string) {
    const previousDir = this._direction;
    this._direction = direction;
    if (previousDir !== this.direction) {
      this._setElementClass(previousDir, false);
      this._setElementClass(this.direction, true);

      if (this.isInitialized) {
        this.setActionsVisibility();
      }
    }
  }

  @Input() get animationMode() {
    return this._animationMode;
  }

  set animationMode(animationMode: string) {
    const previousAnimationMode = this._animationMode;
    this._animationMode = animationMode;
    if (previousAnimationMode !== this._animationMode) {
      this._setElementClass(previousAnimationMode, false);
      this._setElementClass(this.animationMode, true);

      if (this.isInitialized) {
        Promise.resolve(null).then(() => this.open = false);
      }
    }
  }

  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ContentChild(FabSpeedDialActionsComponent) _childActions: FabSpeedDialActionsComponent;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
  }

  ngAfterContentInit(): void {
    this.isInitialized = true;
    this.setActionsVisibility();
    this._setElementClass(this.direction, true);
    this._setElementClass(this.animationMode, true);
  }

  public toggle() {
    this.open = !this.open;
  }

  @HostListener('click')
  _onClick() {
    if (!this.fixed && this.open) {
      this.open = false;
    }
  }

  setActionsVisibility() {
    if (this.open) {
      this._childActions.show();
    } else {
      this._childActions.hide();
    }
  }

  private _setElementClass(elemClass: string, isAdd: boolean) {
    this.renderer.setElementClass(this.elementRef.nativeElement, `${elemClass}`, isAdd);
  }
}

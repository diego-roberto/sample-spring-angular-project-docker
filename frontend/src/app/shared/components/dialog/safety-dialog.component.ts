import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'safety-dialog',
  templateUrl: 'safety-dialog.component.html',
  styleUrls: ['./safety-dialog.component.scss']
})
export class SafetyDialogComponent {

  clickedOutSide = 0;
  topBarDisabled = false;
  bottomBarDisabled = false;
  actionsDisabled = false;

  @Input()
  set topBarDisable(v: boolean) {
    this.topBarDisabled = this.coerceBooleanProperty(v);
  }

  @Input()
  set bottomBarDisable(v: boolean) {
    this.bottomBarDisabled = this.coerceBooleanProperty(v);
  }

  @Input()
  set actionsDisable(v: boolean) {
    this.actionsDisabled = this.coerceBooleanProperty(v);
  }

  @Output() remove = new EventEmitter<boolean>();

  coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
  }

  constructor(private dialogRef: MdDialogRef<SafetyDialogComponent>) { }

  closeDialog() {
    this.remove.emit(false);
    this.dialogRef.close();
  }
}

@Component({
  selector: 'safety-dialog-header',
  template: '<ng-content></ng-content>',
})
export class SafetyDialogHeaderComponent { }

@Component({
  selector: 'safety-dialog-content',
  template: '<ng-content></ng-content>',
})
export class SafetyDialogContentComponent { }

@Component({
  selector: 'safety-dialog-actions',
  template: '<ng-content></ng-content>',
})
export class SafetyDialogActionsComponent { }

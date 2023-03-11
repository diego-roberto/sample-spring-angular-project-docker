import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModuleProfileCreateDialogComponent } from './settings-module-profile-create-dialog.component';

describe('SettingsModuleProfileCreateDialogComponent', () => {
  let component: SettingsModuleProfileCreateDialogComponent;
  let fixture: ComponentFixture<SettingsModuleProfileCreateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsModuleProfileCreateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsModuleProfileCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

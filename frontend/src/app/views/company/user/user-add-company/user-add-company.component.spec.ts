import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddCompanyComponent } from './user-add-company.component';

describe('UserAddCompanyComponent', () => {
  let component: UserAddCompanyComponent;
  let fixture: ComponentFixture<UserAddCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

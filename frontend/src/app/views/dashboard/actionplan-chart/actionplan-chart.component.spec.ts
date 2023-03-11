import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanChartComponent } from './actionplan-chart.component';

describe('ActionPlanChartComponent', () => {
  let component: ActionPlanChartComponent;
  let fixture: ComponentFixture<ActionPlanChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPlanChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricReprocessComponent } from './metric-reprocess.component';

describe('MetricReprocessComponent', () => {
  let component: MetricReprocessComponent;
  let fixture: ComponentFixture<MetricReprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricReprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricReprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

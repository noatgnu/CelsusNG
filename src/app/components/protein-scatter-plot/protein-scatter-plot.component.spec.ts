import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinScatterPlotComponent } from './protein-scatter-plot.component';

describe('ProteinScatterPlotComponent', () => {
  let component: ProteinScatterPlotComponent;
  let fixture: ComponentFixture<ProteinScatterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProteinScatterPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

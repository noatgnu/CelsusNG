import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestProjectComponent } from './latest-project.component';

describe('LatestProjectComponent', () => {
  let component: LatestProjectComponent;
  let fixture: ComponentFixture<LatestProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSelectionPromptComponent } from './batch-selection-prompt.component';

describe('BatchSelectionPromptComponent', () => {
  let component: BatchSelectionPromptComponent;
  let fixture: ComponentFixture<BatchSelectionPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchSelectionPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSelectionPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomViewComponent } from './create-custom-view.component';

describe('CreateCustomViewComponent', () => {
  let component: CreateCustomViewComponent;
  let fixture: ComponentFixture<CreateCustomViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

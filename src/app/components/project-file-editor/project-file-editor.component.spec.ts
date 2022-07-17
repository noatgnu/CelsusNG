import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFileEditorComponent } from './project-file-editor.component';

describe('ProjectFileEditorComponent', () => {
  let component: ProjectFileEditorComponent;
  let fixture: ComponentFixture<ProjectFileEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectFileEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

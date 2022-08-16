import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSidebarNewComponent } from './app-sidebar-new.component';

describe('AppSidebarNewComponent', () => {
  let component: AppSidebarNewComponent;
  let fixture: ComponentFixture<AppSidebarNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AppSidebarNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSidebarNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

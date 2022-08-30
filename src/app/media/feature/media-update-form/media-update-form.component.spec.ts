import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaUpdateFormComponent } from './media-update-form.component';

describe('MediaUpdateFormComponent', () => {
  let component: MediaUpdateFormComponent;
  let fixture: ComponentFixture<MediaUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MediaUpdateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

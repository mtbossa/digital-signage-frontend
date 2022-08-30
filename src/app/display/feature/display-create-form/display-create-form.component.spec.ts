import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCreateFormComponent } from './display-create-form.component';

describe('MediaCreateFormComponent', () => {
  let component: MediaCreateFormComponent;
  let fixture: ComponentFixture<MediaCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MediaCreateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

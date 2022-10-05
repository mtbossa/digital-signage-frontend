import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSearchableTableComponent } from './app-searchable-table.component';

describe('AppSearchableTableComponent', () => {
  let component: AppSearchableTableComponent;
  let fixture: ComponentFixture<AppSearchableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AppSearchableTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSearchableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

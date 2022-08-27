import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudHostComponent } from './crud-host.component';

describe('CrudHostComponent', () => {
  let component: CrudHostComponent;
  let fixture: ComponentFixture<CrudHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudHostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

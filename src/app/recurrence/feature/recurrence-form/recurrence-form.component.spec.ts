import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecurrenceFormComponent } from "./recurrence-form.component";

describe("RecurrenceFormComponent", () => {
  let component: RecurrenceFormComponent;
  let fixture: ComponentFixture<RecurrenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrenceFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurrenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecurrenceCreateFormComponent } from "./recurrence-create-form.component";

describe("RecurrenceCreateFormComponent", () => {
  let component: RecurrenceCreateFormComponent;
  let fixture: ComponentFixture<RecurrenceCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrenceCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurrenceCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

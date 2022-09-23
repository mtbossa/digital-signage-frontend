import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecurrenceUpdateFormComponent } from "./recurrence-update-form.component";

describe("RecurrenceUpdateFormComponent", () => {
  let component: RecurrenceUpdateFormComponent;
  let fixture: ComponentFixture<RecurrenceUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrenceUpdateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurrenceUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

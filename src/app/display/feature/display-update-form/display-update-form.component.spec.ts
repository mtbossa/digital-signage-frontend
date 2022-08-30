import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayUpdateFormComponent } from "./display-update-form.component";

describe("DisplayUpdateFormComponent", () => {
  let component: DisplayUpdateFormComponent;
  let fixture: ComponentFixture<DisplayUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayUpdateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

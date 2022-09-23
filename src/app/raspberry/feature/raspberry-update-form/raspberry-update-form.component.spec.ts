import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RaspberryUpdateFormComponent } from "./raspberry-update-form.component";

describe("RaspberryUpdateFormComponent", () => {
  let component: RaspberryUpdateFormComponent;
  let fixture: ComponentFixture<RaspberryUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaspberryUpdateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaspberryUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

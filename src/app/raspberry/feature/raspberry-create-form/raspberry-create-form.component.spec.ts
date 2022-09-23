import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RaspberryCreateFormComponent } from "./raspberry-create-form.component";

describe("RaspberryCreateFormComponent", () => {
  let component: RaspberryCreateFormComponent;
  let fixture: ComponentFixture<RaspberryCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaspberryCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaspberryCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

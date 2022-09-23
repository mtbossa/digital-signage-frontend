import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RaspberryFormComponent } from "./raspberry-form.component";

describe("RaspberryFormComponent", () => {
  let component: RaspberryFormComponent;
  let fixture: ComponentFixture<RaspberryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaspberryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaspberryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

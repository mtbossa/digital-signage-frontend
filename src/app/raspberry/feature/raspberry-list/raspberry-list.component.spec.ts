import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RaspberryListComponent } from "./raspberry-list.component";

describe("RaspberryListComponent", () => {
  let component: RaspberryListComponent;
  let fixture: ComponentFixture<RaspberryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaspberryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaspberryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

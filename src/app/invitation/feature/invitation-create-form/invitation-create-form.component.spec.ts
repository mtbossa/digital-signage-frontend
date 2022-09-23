import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InvitationCreateFormComponent } from "./invitation-create-form.component";

describe("InvitationCreateFormComponent", () => {
  let component: InvitationCreateFormComponent;
  let fixture: ComponentFixture<InvitationCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PostUpdateFormComponent } from "./post-update-form.component";

describe("PostUpdateFormComponent", () => {
  let component: PostUpdateFormComponent;
  let fixture: ComponentFixture<PostUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostUpdateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

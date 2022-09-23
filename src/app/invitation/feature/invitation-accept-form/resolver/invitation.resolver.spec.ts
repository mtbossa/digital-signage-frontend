import { TestBed } from "@angular/core/testing";

import { InvitationResolver } from "./invitation.resolver";

describe("InvitationResolver", () => {
  let service: InvitationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationResolver);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

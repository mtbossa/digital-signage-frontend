import { TestBed } from "@angular/core/testing";

import { CrudPortalService } from "./crud-portal.service";

describe("CrudPortalService", () => {
  let service: CrudPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudPortalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

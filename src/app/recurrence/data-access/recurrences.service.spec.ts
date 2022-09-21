import { TestBed } from "@angular/core/testing";

import { RecurrencesService } from "./recurrences.service";

describe("RecurrencesService", () => {
  let service: RecurrencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecurrencesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

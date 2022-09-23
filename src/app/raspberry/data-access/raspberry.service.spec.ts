import { TestBed } from "@angular/core/testing";

import { RaspberriesService } from "./raspberry.service";

describe("RaspberriesService", () => {
  let service: RaspberriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaspberriesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

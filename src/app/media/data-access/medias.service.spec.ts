import { TestBed } from "@angular/core/testing";

import { MediasServiceService } from "./medias.service";

describe("MediasServiceService", () => {
  let service: MediasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediasServiceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

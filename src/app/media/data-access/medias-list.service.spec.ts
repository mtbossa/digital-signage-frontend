import { TestBed } from '@angular/core/testing';

import { MediasListService } from './medias-list.service';

describe('MediasListService', () => {
  let service: MediasListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediasListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

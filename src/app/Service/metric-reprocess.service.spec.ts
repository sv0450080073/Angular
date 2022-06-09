import { TestBed } from '@angular/core/testing';

import { MetricReprocessService } from './metric-reprocess.service';

describe('MetricReprocessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetricReprocessService = TestBed.get(MetricReprocessService);
    expect(service).toBeTruthy();
  });
});

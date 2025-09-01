import { TestBed } from '@angular/core/testing';

import { CartMapService } from './cart-map.service';

describe('CartMapService', () => {
  let service: CartMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

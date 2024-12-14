import { TestBed } from '@angular/core/testing';

import { PasswordOptionsService } from './password-options.service';

describe('PasswordOptionsService', () => {
  let service: PasswordOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

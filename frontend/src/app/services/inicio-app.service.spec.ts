import { TestBed } from '@angular/core/testing';

import { InicioAppService } from './inicio-app.service';

describe('InicioAppService', () => {
  let service: InicioAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InicioAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

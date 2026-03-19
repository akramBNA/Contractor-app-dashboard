import { TestBed } from '@angular/core/testing';

import { DeleteWithUndoService } from './delete-with-undo.service';

describe('DeleteWithUndoService', () => {
  let service: DeleteWithUndoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteWithUndoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

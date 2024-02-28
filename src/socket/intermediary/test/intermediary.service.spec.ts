import { Test, TestingModule } from '@nestjs/testing';
import { IntermediaryService } from '../intermediary.service';

describe('IntermediaryService', () => {
  let service: IntermediaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntermediaryService],
    }).compile();

    service = module.get<IntermediaryService>(IntermediaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

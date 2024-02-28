import { Test, TestingModule } from '@nestjs/testing';
import { IntermediaryGateway } from '../intermediary.gateway';
import { IntermediaryService } from '../intermediary.service';

describe('IntermediaryGateway', () => {
  let gateway: IntermediaryGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntermediaryGateway, IntermediaryService],
    }).compile();

    gateway = module.get<IntermediaryGateway>(IntermediaryGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

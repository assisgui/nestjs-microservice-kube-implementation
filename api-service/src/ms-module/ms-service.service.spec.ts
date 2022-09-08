import { Test, TestingModule } from '@nestjs/testing';
import { MsServiceService } from './ms-service.service';

describe('MsServiceService', () => {
  let service: MsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsServiceService],
    }).compile();

    service = module.get<MsServiceService>(MsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

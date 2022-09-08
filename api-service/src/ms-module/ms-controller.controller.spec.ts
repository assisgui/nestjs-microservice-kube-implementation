import { Test, TestingModule } from '@nestjs/testing';
import { MsControllerController } from './ms-controller.controller';

describe('MsControllerController', () => {
  let controller: MsControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsControllerController],
    }).compile();

    controller = module.get<MsControllerController>(MsControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AisavedrecipeController } from './aisavedrecipe.controller';

describe('AisavedrecipeController', () => {
  let controller: AisavedrecipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AisavedrecipeController],
    }).compile();

    controller = module.get<AisavedrecipeController>(AisavedrecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AvisosController } from './avisos.controller';

describe('AvisosController', () => {
  let controller: AvisosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvisosController],
    }).compile();

    controller = module.get<AvisosController>(AvisosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

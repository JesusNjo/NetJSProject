import { Test, TestingModule } from '@nestjs/testing';
import { CharacterParticipationController } from './character-participation.controller';
import { CharacterParticipationService } from './character-participation.service';

describe('CharacterParticipationController', () => {
  let controller: CharacterParticipationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterParticipationController],
      providers: [CharacterParticipationService],
    }).compile();

    controller = module.get<CharacterParticipationController>(CharacterParticipationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

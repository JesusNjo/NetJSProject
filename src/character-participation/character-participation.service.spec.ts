import { Test, TestingModule } from '@nestjs/testing';
import { CharacterParticipationService } from './character-participation.service';

describe('CharacterParticipationService', () => {
  let service: CharacterParticipationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacterParticipationService],
    }).compile();

    service = module.get<CharacterParticipationService>(CharacterParticipationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { QuizzController } from './quizz.controller';
import { QuizzService } from './quizz.service';

@Module({
  providers: [QuizzService],
  controllers: [QuizzController],
  exports: [QuizzService]
})
export class QuizzModule {}

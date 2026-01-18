import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}

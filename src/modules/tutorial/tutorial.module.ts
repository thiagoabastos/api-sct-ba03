import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';

@Module({
  controllers: [TutorialController],
  providers: [TutorialService, PrismaService],
  exports: [TutorialService],
})
export class TutorialModule {}

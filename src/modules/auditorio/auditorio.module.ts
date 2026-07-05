import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditorioController } from './auditorio.controller';
import { AuditorioService } from './auditorio.service';

@Module({
  controllers: [AuditorioController],
  providers: [AuditorioService, PrismaService],
  exports: [AuditorioService],
})
export class AuditorioModule {}

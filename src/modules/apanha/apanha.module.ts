import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApanhaController } from './apanha.controller';
import { ApanhaService } from './apanha.service';

@Module({
  controllers: [ApanhaController],
  providers: [ApanhaService, PrismaService],
  exports: [ApanhaService],
})
export class ApanhaModule { }

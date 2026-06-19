import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CongregacaoController } from './congregacao.controller';
import { CongregacaoService } from './congregacao.service';

@Module({
  controllers: [CongregacaoController],
  providers: [CongregacaoService, PrismaService],
  exports: [CongregacaoService],
})
export class CongregacaoModule { }

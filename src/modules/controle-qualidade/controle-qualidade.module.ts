import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ControleQualidadeController } from './controle-qualidade.controller';
import { ControleQualidadeService } from './controle-qualidade.service';

@Module({
  controllers: [ControleQualidadeController],
  providers: [ControleQualidadeService, PrismaService],
  exports: [ControleQualidadeService, PrismaService],
})
export class ControleQualidadeModule { }

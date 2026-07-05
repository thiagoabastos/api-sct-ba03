import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ArranjoCongregacaoModule } from '../arranjo-congregacao/arranjo-congregacao.module';
import { NomeArranjoCongregacaoController } from './nome-arranjo-congregacao.controller';
import { NomeArranjoCongregacaoService } from './nome-arranjo-congregacao.service';

@Module({
  imports: [ArranjoCongregacaoModule],
  controllers: [NomeArranjoCongregacaoController],
  providers: [NomeArranjoCongregacaoService, PrismaService],
  exports: [NomeArranjoCongregacaoService],
})
export class NomeArranjoCongregacaoModule {}

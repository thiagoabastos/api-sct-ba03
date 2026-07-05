import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FormaPagamentoModule } from '../forma-pagamento/forma-pagamento.module';
import { ArranjoCongregacaoController } from './arranjo-congregacao.controller';
import { ArranjoCongregacaoService } from './arranjo-congregacao.service';

@Module({
  imports: [FormaPagamentoModule],
  controllers: [ArranjoCongregacaoController],
  providers: [ArranjoCongregacaoService, PrismaService],
  exports: [ArranjoCongregacaoService],
})
export class ArranjoCongregacaoModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ArranjoCongregacaoModule } from '../arranjo-congregacao/arranjo-congregacao.module';
import { FormaPagamentoModule } from '../forma-pagamento/forma-pagamento.module';
import { PagamentoArranjoCongregacaoController } from './pagamento-arranjo-congregacao.controller';
import { PagamentoArranjoCongregacaoService } from './pagamento-arranjo-congregacao.service';

@Module({
  imports: [ArranjoCongregacaoModule, FormaPagamentoModule],
  controllers: [PagamentoArranjoCongregacaoController],
  providers: [PagamentoArranjoCongregacaoService, PrismaService],
  exports: [PagamentoArranjoCongregacaoService],
})
export class PagamentoArranjoCongregacaoModule {}

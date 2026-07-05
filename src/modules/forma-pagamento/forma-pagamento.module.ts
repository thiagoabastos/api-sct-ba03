import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FormaPagamentoController } from './forma-pagamento.controller';
import { FormaPagamentoService } from './forma-pagamento.service';

@Module({
  controllers: [FormaPagamentoController],
  providers: [FormaPagamentoService, PrismaService],
  exports: [FormaPagamentoService],
})
export class FormaPagamentoModule {}

import { StatusPagamento } from '@prisma/client';

export interface ArranjoCongregacaoFiltros {
  eventoId?: number;
  congregacaoId?: number;
  status?: StatusPagamento;
  page?: number;
  limit?: number;
}

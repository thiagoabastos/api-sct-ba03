import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusPagamento } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePagamentoArranjoCongregacaoDto } from './dto/create-pagamento-arranjo-congregacao.dto';
import { PagamentoArranjoCongregacaoFiltros } from './interfaces/pagamento-arranjo-filtros.interface';

const SELECT_PAGAMENTO = {
  id: true,
  valor: true,
  createdAt: true,
  updatedAt: true,
  formaPagamento: {
    select: { id: true, nome: true },
  },
  arranjoCongregacao: {
    select: {
      id: true,
      status: true,
      congregacao: { select: { id: true, nome: true } },
      evento: {
        select: {
          id: true,
          ano: true,
          valor: true,
          eventoTipo: { select: { id: true, nome: true } },
        },
      },
    },
  },
};

@Injectable()
export class PagamentoArranjoCongregacaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePagamentoArranjoCongregacaoDto) {
    await this.validarArranjo(dto.arranjoCongregacaoId);
    await this.validarFormaPagamento(dto.formaPagamentoId);

    if (Number(dto.valor) <= 0) {
      throw new BadRequestException('Valor do pagamento deve ser maior que zero');
    }

    const pagamento = await this.prisma.pagamentoArranjoCongregacao.create({
      data: {
        arranjoCongregacao: { connect: { id: dto.arranjoCongregacaoId } },
        formaPagamento: { connect: { id: dto.formaPagamentoId } },
        valor: dto.valor,
      },
      select: SELECT_PAGAMENTO,
    });

    // Recalcula status do arranjo após novo pagamento
    await this.recalcularStatus(dto.arranjoCongregacaoId);

    return pagamento;
  }

  async findAll(filtros: PagamentoArranjoCongregacaoFiltros = {}) {
    const { arranjoCongregacaoId, formaPagamentoId, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(arranjoCongregacaoId && { arranjoCongregacaoId }),
      ...(formaPagamentoId && { formaPagamentoId }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.pagamentoArranjoCongregacao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: SELECT_PAGAMENTO,
      }),
      this.prisma.pagamentoArranjoCongregacao.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByArranjo(arranjoCongregacaoId: number) {
    await this.validarArranjo(arranjoCongregacaoId);

    const pagamentos = await this.prisma.pagamentoArranjoCongregacao.findMany({
      where: { arranjoCongregacaoId },
      orderBy: { createdAt: 'desc' },
      select: SELECT_PAGAMENTO,
    });

    const totalPago = pagamentos.reduce((sum, p) => sum + Number(p.valor), 0);

    // Busca valor do evento e total de pessoas para calcular o saldo
    const arranjo = await this.prisma.arranjoCongregacao.findUnique({
      where: { id: arranjoCongregacaoId },
      select: {
        status: true,
        evento: { select: { valor: true } },
        _count: { select: { nomes: true } },
      },
    });

    const valorPorPessoa = Number(arranjo?.evento?.valor ?? 0);
    const totalPessoas = arranjo?._count?.nomes ?? 0;
    const totalDevido = valorPorPessoa * totalPessoas;

    return {
      pagamentos,
      resumo: {
        totalPessoas,
        valorPorPessoa,
        totalDevido,
        totalPago,
        saldo: totalPago - totalDevido,
        status: arranjo?.status,
      },
    };
  }

  async findOne(id: number) {
    const pagamento = await this.prisma.pagamentoArranjoCongregacao.findUnique({
      where: { id },
      select: SELECT_PAGAMENTO,
    });

    if (!pagamento) {
      throw new NotFoundException(`Pagamento #${id} não encontrado`);
    }

    return pagamento;
  }

  async remove(id: number): Promise<void> {
    const pagamento = await this.prisma.pagamentoArranjoCongregacao.findUnique({
      where: { id },
      select: { id: true, arranjoCongregacaoId: true },
    });

    if (!pagamento) {
      throw new NotFoundException(`Pagamento #${id} não encontrado`);
    }

    await this.prisma.pagamentoArranjoCongregacao.delete({ where: { id } });

    // Recalcula status do arranjo após remoção
    await this.recalcularStatus(pagamento.arranjoCongregacaoId);
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async recalcularStatus(arranjoCongregacaoId: number): Promise<void> {
    const arranjo = await this.prisma.arranjoCongregacao.findUnique({
      where: { id: arranjoCongregacaoId },
      include: {
        evento: { select: { valor: true } },
        pagamentos: { select: { valor: true } },
        _count: { select: { nomes: true } },
      },
    });

    if (!arranjo || !arranjo.evento.valor) return;

    const totalPessoas = arranjo._count.nomes;
    if (totalPessoas === 0) return;

    const totalDevido = Number(arranjo.evento.valor) * totalPessoas;
    const totalPago = arranjo.pagamentos.reduce(
      (sum, p) => sum + Number(p.valor),
      0,
    );

    const novoStatus =
      totalPago >= totalDevido
        ? StatusPagamento.pago
        : StatusPagamento.pendente;

    await this.prisma.arranjoCongregacao.update({
      where: { id: arranjoCongregacaoId },
      data: {
        status: novoStatus,
        dataPago:
          novoStatus === StatusPagamento.pago ? new Date() : null,
      },
    });
  }

  private async validarArranjo(id: number): Promise<void> {
    const existe = await this.prisma.arranjoCongregacao.findUnique({
      where: { id },
    });
    if (!existe) {
      throw new NotFoundException(`Arranjo #${id} não encontrado`);
    }
  }

  private async validarFormaPagamento(id: number): Promise<void> {
    const existe = await this.prisma.formaPagamento.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Forma de pagamento #${id} não encontrada`);
    }
  }
}

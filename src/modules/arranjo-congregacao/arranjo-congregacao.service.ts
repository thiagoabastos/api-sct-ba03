import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusPagamento } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArranjoCongregacaoDto } from './dto/create-arranjo-congregacao.dto';
import { UpdateArranjoCongregacaoDto } from './dto/update-arranjo-congregacao.dto';
import { ArranjoCongregacaoFiltros } from './interfaces/arranjo-filtros.interface';
import { UsuarioLogado } from './interfaces/usuario-logado.interface';

const SELECT_ARRANJO = {
  id: true,
  status: true,
  dataPago: true,
  observacoes: true,
  createdAt: true,
  updatedAt: true,
  congregacao: {
    select: { id: true, nome: true },
  },
  evento: {
    select: {
      id: true,
      ano: true,
      valor: true,
      dataEvento: true,
      dataLimiteNome: true,
      dataLimitePagamento: true,
      dataLimiteDeposito: true,
      horarioSaidaOnibus: true,
      eventoTipo: { select: { id: true, nome: true, tipo: true } },
      auditorio: { select: { id: true, nome: true } },
    },
  },
  criado: { select: { id: true, nome: true } },
  atualizado: { select: { id: true, nome: true } },
  _count: {
    select: {
      nomes: true,
      pagamentos: true,
    },
  },
};

@Injectable()
export class ArranjoCongregacaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateArranjoCongregacaoDto, usuarioLogado: UsuarioLogado) {
    await this.validarCongregacao(dto.congregacaoId);
    await this.validarEvento(dto.eventoId);

    const existe = await this.prisma.arranjoCongregacao.findFirst({
      where: { congregacaoId: dto.congregacaoId, eventoId: dto.eventoId },
    });

    if (existe) {
      throw new ConflictException(
        'Já existe um arranjo para essa congregação neste evento',
      );
    }

    return this.prisma.arranjoCongregacao.create({
      data: {
        congregacao: { connect: { id: dto.congregacaoId } },
        evento: { connect: { id: dto.eventoId } },
        status: dto.status ?? StatusPagamento.pendente,
        dataPago: dto.dataPago ? new Date(dto.dataPago) : undefined,
        observacoes: dto.observacoes,
        criado: { connect: { id: usuarioLogado.id } },
        atualizado: { connect: { id: usuarioLogado.id } },
      },
      select: SELECT_ARRANJO,
    });
  }

  async findAll(filtros: ArranjoCongregacaoFiltros = {}) {
    const { eventoId, congregacaoId, status, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(eventoId && { eventoId }),
      ...(congregacaoId && { congregacaoId }),
      ...(status && { status }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.arranjoCongregacao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: SELECT_ARRANJO,
      }),
      this.prisma.arranjoCongregacao.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const arranjo = await this.prisma.arranjoCongregacao.findUnique({
      where: { id },
      select: {
        ...SELECT_ARRANJO,
        nomes: {
          orderBy: { pessoa: { nome: 'asc' } },
          select: {
            id: true,
            menorIdade: true,
            sexta: true,
            sabado: true,
            domingo: true,
            carro: true,
            carroSexta: true,
            carroSabado: true,
            carroDomingo: true,
            ida: true,
            idaSexta: true,
            idaSabado: true,
            idaDomingo: true,
            volta: true,
            voltaSexta: true,
            voltaSabado: true,
            voltaDomingo: true,
            observacao: true,
            observacaoSexta: true,
            observacaoSabado: true,
            observacaoDomingo: true,
            pessoa: { select: { id: true, nome: true } },
          },
        },
        pagamentos: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            valor: true,
            createdAt: true,
            formaPagamento: { select: { id: true, nome: true } },
          },
        },
      },
    });

    if (!arranjo) {
      throw new NotFoundException(`Arranjo #${id} não encontrado`);
    }

    // Calcula total pago e saldo
    const totalPago = arranjo.pagamentos.reduce(
      (sum, p) => sum + Number(p.valor),
      0,
    );

    const valorEvento = Number(arranjo.evento.valor ?? 0);
    const totalPessoas = arranjo.nomes.length;
    const totalDevido = valorEvento * totalPessoas;

    return {
      ...arranjo,
      resumoFinanceiro: {
        totalPessoas,
        valorPorPessoa: valorEvento,
        totalDevido,
        totalPago,
        saldo: totalPago - totalDevido,
      },
    };
  }

  async update(
    id: number,
    dto: UpdateArranjoCongregacaoDto,
    usuarioLogado: UsuarioLogado,
  ) {
    await this.findOne(id);

    return this.prisma.arranjoCongregacao.update({
      where: { id },
      data: {
        status: dto.status,
        dataPago: dto.dataPago ? new Date(dto.dataPago) : undefined,
        observacoes: dto.observacoes,
        atualizado: { connect: { id: usuarioLogado.id } },
      },
      select: SELECT_ARRANJO,
    });
  }

  async remove(id: number): Promise<void> {
    const arranjo = await this.prisma.arranjoCongregacao.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            nomes: true,
            pagamentos: true,
          },
        },
      },
    });

    if (!arranjo) {
      throw new NotFoundException(`Arranjo #${id} não encontrado`);
    }

    await this.prisma.$transaction([
      this.prisma.nomeArranjoCongregacao.deleteMany({
        where: { arranjoCongregacaoId: id },
      }),
      this.prisma.pagamentoArranjoCongregacao.deleteMany({
        where: { arranjoCongregacaoId: id },
      }),
      this.prisma.arranjoCongregacao.delete({ where: { id } }),
    ]);
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarCongregacao(id: number): Promise<void> {
    const existe = await this.prisma.congregacao.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Congregação #${id} não encontrada`);
    }
  }

  private async validarEvento(id: number): Promise<void> {
    const existe = await this.prisma.evento.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Evento #${id} não encontrado`);
    }
  }
}

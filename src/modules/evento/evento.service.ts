import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { EventoFiltros } from './interfaces/evento-filtros.interface';

const SELECT_EVENTO = {
  id: true,
  ano: true,
  valor: true,
  dataEvento: true,
  dataLimiteNome: true,
  dataLimitePagamento: true,
  dataLimiteDeposito: true,
  horarioSaidaOnibus: true,
  createdAt: true,
  updatedAt: true,
  eventoTipo: {
    select: { id: true, nome: true, tipo: true, horario: true },
  },
  auditorio: {
    select: { id: true, nome: true, fusoHorario: true },
  },
  congregacoes: {
    select: {
      congregacao: { select: { id: true, nome: true } },
    },
  },
};

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateEventoDto) {
    await this.validarEventoTipo(dto.eventoTipoId);
    if (dto.auditorioId) await this.validarAuditorio(dto.auditorioId);
    if (dto.congregacaoIds?.length) {
      await this.validarCongregacoes(dto.congregacaoIds);
    }

    const { congregacaoIds, ...dadosEvento } = dto;

    return this.prisma.evento.create({
      data: {
        ...dadosEvento,
        dataEvento: dto.dataEvento ? new Date(dto.dataEvento) : undefined,
        dataLimiteNome: dto.dataLimiteNome ? new Date(dto.dataLimiteNome) : undefined,
        dataLimitePagamento: dto.dataLimitePagamento ? new Date(dto.dataLimitePagamento) : undefined,
        dataLimiteDeposito: dto.dataLimiteDeposito ? new Date(dto.dataLimiteDeposito) : undefined,
        congregacoes: congregacaoIds?.length
          ? {
            create: congregacaoIds.map((congregacaoId) => ({
              congregacao: { connect: { id: congregacaoId } },
            })),
          }
          : undefined,
      },
      select: SELECT_EVENTO,
    });
  }

  async findAll(filtros: EventoFiltros = {}) {
    const { ano, eventoTipoId, auditorioId, congregacaoId, page = 1, limit = 8 } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(ano && { ano }),
      ...(eventoTipoId && { eventoTipoId }),
      ...(auditorioId && { auditorioId }),
      ...(congregacaoId && {
        congregacoes: { some: { congregacaoId } },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.evento.findMany({
        where,
        orderBy: [{ ano: 'desc' }, { dataEvento: 'desc' }],
        skip,
        take: limit,
        select: SELECT_EVENTO,
      }),
      this.prisma.evento.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      select: {
        ...SELECT_EVENTO,
        _count: {
          select: {
            arranjos: true,
            organizarCarros: true,
          },
        },
      },
    });

    if (!evento) {
      throw new NotFoundException(`Evento #${id} não encontrado`);
    }

    return evento;
  }

  async update(id: number, dto: UpdateEventoDto) {
    await this.findOne(id);

    if (dto.eventoTipoId) await this.validarEventoTipo(dto.eventoTipoId);
    if (dto.auditorioId) await this.validarAuditorio(dto.auditorioId);
    if (dto.congregacaoIds?.length) {
      await this.validarCongregacoes(dto.congregacaoIds);
    }

    const { congregacaoIds, ...dadosEvento } = dto;

    return this.prisma.evento.update({
      where: { id },
      data: {
        ...dadosEvento,
        dataEvento: dto.dataEvento ? new Date(dto.dataEvento) : undefined,
        dataLimiteNome: dto.dataLimiteNome ? new Date(dto.dataLimiteNome) : undefined,
        dataLimitePagamento: dto.dataLimitePagamento ? new Date(dto.dataLimitePagamento) : undefined,
        dataLimiteDeposito: dto.dataLimiteDeposito ? new Date(dto.dataLimiteDeposito) : undefined,
        congregacoes: congregacaoIds
          ? {
            deleteMany: {},
            create: congregacaoIds.map((congregacaoId) => ({
              congregacao: { connect: { id: congregacaoId } },
            })),
          }
          : undefined,
      },
      select: SELECT_EVENTO,
    });
  }

  async adicionarCongregacao(eventoId: number, congregacaoId: number) {
    await this.findOne(eventoId);
    await this.validarCongregacoes([congregacaoId]);

    const jaVinculada = await this.prisma.eventoCongregacao.findFirst({
      where: { eventoId, congregacaoId },
    });

    if (jaVinculada) {
      throw new ConflictException('Congregação já está vinculada a este evento');
    }

    return this.prisma.eventoCongregacao.create({
      data: {
        evento: { connect: { id: eventoId } },
        congregacao: { connect: { id: congregacaoId } },
      },
      select: {
        congregacao: { select: { id: true, nome: true } },
        evento: { select: { id: true, ano: true } },
      },
    });
  }

  async removerCongregacao(eventoId: number, congregacaoId: number): Promise<void> {
    const vinculo = await this.prisma.eventoCongregacao.findFirst({
      where: { eventoId, congregacaoId },
    });

    if (!vinculo) {
      throw new NotFoundException('Congregação não está vinculada a este evento');
    }

    await this.prisma.eventoCongregacao.deleteMany({
      where: { eventoId, congregacaoId },
    });
  }

  async remove(id: number): Promise<void> {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            arranjos: true,
            organizarCarros: true,
          },
        },
      },
    });

    if (!evento) {
      throw new NotFoundException(`Evento #${id} não encontrado`);
    }

    if (evento._count.arranjos > 0 || evento._count.organizarCarros > 0) {
      throw new ConflictException(
        `Evento possui ${evento._count.arranjos} arranjo(s) e ` +
        `${evento._count.organizarCarros} organização(ões) de carro vinculados e não pode ser excluído`,
      );
    }

    await this.prisma.$transaction([
      this.prisma.eventoCongregacao.deleteMany({ where: { eventoId: id } }),
      this.prisma.evento.delete({ where: { id } }),
    ]);
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarEventoTipo(id: number): Promise<void> {
    const existe = await this.prisma.eventoTipo.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Tipo de evento #${id} não encontrado`);
    }
  }

  private async validarAuditorio(id: number): Promise<void> {
    const existe = await this.prisma.auditorio.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Auditório #${id} não encontrado`);
    }
  }

  private async validarCongregacoes(ids: number[]): Promise<void> {
    const encontradas = await this.prisma.congregacao.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (encontradas.length !== ids.length) {
      const encontradasIds = encontradas.map((c) => c.id);
      const naoEncontradas = ids.filter((id) => !encontradasIds.includes(id));
      throw new NotFoundException(
        `Congregação(ões) não encontrada(s): ${naoEncontradas.join(', ')}`,
      );
    }
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoTipoDto } from './dto/create-evento-tipo.dto';
import { UpdateEventoTipoDto } from './dto/update-evento-tipo.dto';

export interface EventoTipoFiltros {
  nome?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class EventoTipoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventoTipoDto) {
    const existe = await this.prisma.eventoTipo.findUnique({
      where: { nome: dto.nome },
    });

    if (existe) {
      throw new ConflictException(`Tipo de evento "${dto.nome}" já existe`);
    }

    return this.prisma.eventoTipo.create({ data: dto });
  }

  async findAll(filtros: EventoTipoFiltros = {}) {
    const { nome, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = nome
      ? { nome: { contains: nome, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.eventoTipo.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
        include: { _count: { select: { eventos: true } } },
      }),
      this.prisma.eventoTipo.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const eventoTipo = await this.prisma.eventoTipo.findUnique({
      where: { id },
      include: {
        eventos: {
          select: { id: true, ano: true, dataEvento: true },
          orderBy: { ano: 'desc' },
          take: 5,
        },
        _count: { select: { eventos: true } },
      },
    });

    if (!eventoTipo) {
      throw new NotFoundException(`Tipo de evento #${id} não encontrado`);
    }

    return eventoTipo;
  }

  async update(id: number, dto: UpdateEventoTipoDto) {
    await this.findOne(id);

    if (dto.nome) {
      const existe = await this.prisma.eventoTipo.findFirst({
        where: { nome: dto.nome, NOT: { id } },
      });
      if (existe) {
        throw new ConflictException(`Tipo de evento "${dto.nome}" já existe`);
      }
    }

    return this.prisma.eventoTipo.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<void> {
    const eventoTipo = await this.prisma.eventoTipo.findUnique({
      where: { id },
      include: { _count: { select: { eventos: true } } },
    });

    if (!eventoTipo) {
      throw new NotFoundException(`Tipo de evento #${id} não encontrado`);
    }

    if (eventoTipo._count.eventos > 0) {
      throw new ConflictException(
        `Tipo de evento "${eventoTipo.nome}" possui ${eventoTipo._count.eventos} evento(s) vinculado(s) e não pode ser excluído`,
      );
    }

    await this.prisma.eventoTipo.delete({ where: { id } });
  }
}

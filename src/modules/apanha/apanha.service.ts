import { Injectable, NotFoundException } from '@nestjs/common';
import { Apanha } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApanhaDto } from './dto/create-apanha.dto';
import { UpdateApanhaDto } from './dto/update-apanha.dto';
import { ApanhaFiltros } from './interfaces/apanha-filtros.interface';

@Injectable()
export class ApanhaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateApanhaDto): Promise<Apanha> {
    await this.validarCongregacao(dto.congregacaoId);

    return this.prisma.apanha.create({
      data: {
        local: dto.local,
        congregacao: { connect: { id: dto.congregacaoId } },
      },
      include: {
        congregacao: { select: { id: true, nome: true } },
      },
    });
  }

  async findAll(filtros: ApanhaFiltros = {}) {
    const { local, congregacaoId, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (local) {
      where.local = { contains: local, mode: 'insensitive' };
    }

    if (congregacaoId) {
      where.congregacaoId = congregacaoId;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.apanha.findMany({
        where,
        orderBy: { local: 'asc' },
        skip,
        take: limit,
        include: {
          congregacao: { select: { id: true, nome: true } },
        },
      }),
      this.prisma.apanha.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByCongregacao(congregacaoId: number) {
    await this.validarCongregacao(congregacaoId);

    return this.prisma.apanha.findMany({
      where: { congregacaoId },
      orderBy: { local: 'asc' },
      include: {
        congregacao: { select: { id: true, nome: true } },
      },
    });
  }

  async findOne(id: number): Promise<Apanha> {
    const apanha = await this.prisma.apanha.findUnique({
      where: { id },
      include: {
        congregacao: { select: { id: true, nome: true } },
      },
    });

    if (!apanha) {
      throw new NotFoundException(`Apanha #${id} não encontrada`);
    }

    return apanha;
  }

  async update(id: number, dto: UpdateApanhaDto): Promise<Apanha> {
    await this.findOne(id);

    if (dto.congregacaoId) {
      await this.validarCongregacao(dto.congregacaoId);
    }

    return this.prisma.apanha.update({
      where: { id },
      data: {
        local: dto.local,
        congregacaoId: dto.congregacaoId,
      },
      include: {
        congregacao: { select: { id: true, nome: true } },
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.prisma.apanha.delete({ where: { id } });
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarCongregacao(congregacaoId: number): Promise<void> {
    const congregacao = await this.prisma.congregacao.findUnique({
      where: { id: congregacaoId },
      select: { id: true },
    });

    if (!congregacao) {
      throw new NotFoundException(
        `Congregação #${congregacaoId} não encontrada`,
      );
    }
  }
}

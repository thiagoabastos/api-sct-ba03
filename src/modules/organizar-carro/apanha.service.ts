import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApanhaDto } from './dto/create-apanha.dto';
import { UpdateApanhaDto } from './dto/update-apanha.dto';
import { ApanhaFiltros } from './interfaces/organizar-carro-filtros.interface';

@Injectable()
export class ApanhaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApanhaDto) {
    await this.validarCongregacao(dto.congregacaoId);

    const existe = await this.prisma.apanha.findFirst({
      where: {
        local: { equals: dto.local, mode: 'insensitive' },
        congregacaoId: dto.congregacaoId,
      },
    });

    if (existe) {
      throw new ConflictException(
        `Ponto de apanha "${dto.local}" já existe nesta congregação`,
      );
    }

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
    const { congregacaoId, local, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(congregacaoId && { congregacaoId }),
      ...(local && { local: { contains: local, mode: 'insensitive' as const } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.apanha.findMany({
        where,
        orderBy: { local: 'asc' },
        skip,
        take: limit,
        include: {
          congregacao: { select: { id: true, nome: true } },
          _count: { select: { organizarCarros: true } },
        },
      }),
      this.prisma.apanha.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
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

  async findOne(id: number) {
    const apanha = await this.prisma.apanha.findUnique({
      where: { id },
      include: {
        congregacao: { select: { id: true, nome: true } },
        _count: { select: { organizarCarros: true } },
      },
    });

    if (!apanha) {
      throw new NotFoundException(`Ponto de apanha #${id} não encontrado`);
    }

    return apanha;
  }

  async update(id: number, dto: UpdateApanhaDto) {
    const apanha = await this.prisma.apanha.findUnique({ where: { id } });

    if (!apanha) {
      throw new NotFoundException(`Ponto de apanha #${id} não encontrado`);
    }

    if (dto.congregacaoId) await this.validarCongregacao(dto.congregacaoId);

    const congregacaoId = dto.congregacaoId ?? apanha.congregacaoId;
    const local = dto.local ?? apanha.local;

    const existe = await this.prisma.apanha.findFirst({
      where: {
        local: { equals: local, mode: 'insensitive' },
        congregacaoId,
        NOT: { id },
      },
    });

    if (existe) {
      throw new ConflictException(
        `Ponto de apanha "${local}" já existe nesta congregação`,
      );
    }

    return this.prisma.apanha.update({
      where: { id },
      data: {
        local: dto.local,
        ...(dto.congregacaoId && {
          congregacao: { connect: { id: dto.congregacaoId } },
        }),
      },
      include: {
        congregacao: { select: { id: true, nome: true } },
      },
    });
  }

  async remove(id: number): Promise<void> {
    const apanha = await this.prisma.apanha.findUnique({
      where: { id },
      include: { _count: { select: { organizarCarros: true } } },
    });

    if (!apanha) {
      throw new NotFoundException(`Ponto de apanha #${id} não encontrado`);
    }

    if (apanha._count.organizarCarros > 0) {
      throw new ConflictException(
        `Ponto de apanha "${apanha.local}" está vinculado a ${apanha._count.organizarCarros} organização(ões) de carro e não pode ser excluído`,
      );
    }

    await this.prisma.apanha.delete({ where: { id } });
  }

  private async validarCongregacao(id: number): Promise<void> {
    const existe = await this.prisma.congregacao.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException(`Congregação #${id} não encontrada`);
  }
}

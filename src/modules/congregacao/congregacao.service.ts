import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Congregacao } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCongregacaoDto } from './dto/create-congregacao.dto';
import { UpdateCongregacaoDto } from './dto/update-congregacao.dto';
import { CongregacaoFiltros } from './interfaces/congregacao-filtros.interface';

@Injectable()
export class CongregacaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateCongregacaoDto): Promise<Congregacao> {
    const existe = await this.prisma.congregacao.findUnique({
      where: { nome: dto.nome },
    });

    if (existe) {
      throw new ConflictException(`Congregação "${dto.nome}" já existe`);
    }

    return this.prisma.congregacao.create({
      data: { nome: dto.nome },
    });
  }

  async findAll(filtros: CongregacaoFiltros = {}) {
    const { nome, page = 1, limit = 999 } = filtros;
    const skip = (page - 1) * limit;

    const where = nome
      ? { nome: { contains: nome, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.congregacao.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.congregacao.count({ where }),
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

  async findOne(id: number): Promise<Congregacao> {
    const congregacao = await this.prisma.congregacao.findUnique({
      where: { id },
      include: {
        apanhas: true,
        _count: {
          select: {
            pessoas: true,
            usuarios: true,
          },
        },
      },
    });

    if (!congregacao) {
      throw new NotFoundException(`Congregação #${id} não encontrada`);
    }

    return congregacao;
  }

  async update(id: number, dto: UpdateCongregacaoDto): Promise<Congregacao> {
    await this.findOne(id);

    if (dto.nome) {
      const existe = await this.prisma.congregacao.findFirst({
        where: { nome: dto.nome, NOT: { id } },
      });

      if (existe) {
        throw new ConflictException(`Congregação "${dto.nome}" já existe`);
      }
    }

    return this.prisma.congregacao.update({
      where: { id },
      data: { nome: dto.nome },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.prisma.congregacao.delete({ where: { id } });
  }
}

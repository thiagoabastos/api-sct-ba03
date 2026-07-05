import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Permissao } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';
import { PermissaoFiltros } from './interfaces/permissao-filtros.interface';

@Injectable()
export class PermissaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePermissaoDto): Promise<Permissao> {
    const existe = await this.prisma.permissao.findUnique({
      where: { nome: dto.nome },
    });

    if (existe) {
      throw new ConflictException(`Permissão "${dto.nome}" já existe`);
    }

    return this.prisma.permissao.create({
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
      },
    });
  }

  async findAll(filtros: PermissaoFiltros = {}) {
    const { nome, page = 1, limit = 999 } = filtros;
    const skip = (page - 1) * limit;

    const where = nome
      ? { nome: { contains: nome, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.permissao.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.permissao.count({ where }),
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

  async findOne(id: number): Promise<Permissao & { tiposUsuarios: { usuarioTipoId: number }[] }> {
    const permissao = await this.prisma.permissao.findUnique({
      where: { id },
      include: {
        tiposUsuarios: {
          select: {
            usuarioTipoId: true,
            usuarioTipo: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!permissao) {
      throw new NotFoundException(`Permissão #${id} não encontrada`);
    }

    return permissao;
  }

  async update(id: number, dto: UpdatePermissaoDto): Promise<Permissao> {
    await this.findOne(id);

    if (dto.nome) {
      const existe = await this.prisma.permissao.findFirst({
        where: { nome: dto.nome, NOT: { id } },
      });

      if (existe) {
        throw new ConflictException(`Permissão "${dto.nome}" já existe`);
      }
    }

    return this.prisma.permissao.update({
      where: { id },
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
      },
    });
  }

  async remove(id: number): Promise<void> {
    const permissao = await this.prisma.permissao.findUnique({
      where: { id },
      include: {
        _count: { select: { tiposUsuarios: true } },
      },
    });

    if (!permissao) {
      throw new NotFoundException(`Permissão #${id} não encontrada`);
    }

    if (permissao._count.tiposUsuarios > 0) {
      throw new ConflictException(
        `Permissão "${permissao.nome}" está vinculada a ${permissao._count.tiposUsuarios} tipo(s) de usuário e não pode ser excluída`,
      );
    }

    await this.prisma.permissao.delete({ where: { id } });
  }
}

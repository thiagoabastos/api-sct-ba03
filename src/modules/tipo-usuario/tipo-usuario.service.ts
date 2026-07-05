import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTipoUsuarioDto } from './dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo-usuario.dto';
import { TipoUsuarioFiltros } from './interfaces/tipo-usuario-filtros.interface';

@Injectable()
export class TipoUsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTipoUsuarioDto) {
    const existe = await this.prisma.tipoUsuario.findUnique({
      where: { nome: dto.nome },
    });

    if (existe) {
      throw new ConflictException(`Tipo de usuário "${dto.nome}" já existe`);
    }

    if (dto.permissaoIds?.length) {
      await this.validarPermissoes(dto.permissaoIds);
    }

    return this.prisma.tipoUsuario.create({
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        permissoes: dto.permissaoIds?.length
          ? {
              create: dto.permissaoIds.map((permissaoId) => ({
                permissao: { connect: { id: permissaoId } },
              })),
            }
          : undefined,
      },
      include: {
        permissoes: {
          include: {
            permissao: {
              select: { id: true, nome: true, descricao: true },
            },
          },
        },
        _count: { select: { usuarios: true } },
      },
    });
  }

  async findAll(filtros: TipoUsuarioFiltros = {}) {
    const { nome, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = nome
      ? { nome: { contains: nome, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tipoUsuario.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
        include: {
          permissoes: {
            include: {
              permissao: {
                select: { id: true, nome: true, descricao: true },
              },
            },
          },
          _count: { select: { usuarios: true } },
        },
      }),
      this.prisma.tipoUsuario.count({ where }),
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

  async findOne(id: number) {
    const tipoUsuario = await this.prisma.tipoUsuario.findUnique({
      where: { id },
      include: {
        permissoes: {
          include: {
            permissao: {
              select: { id: true, nome: true, descricao: true },
            },
          },
        },
        _count: { select: { usuarios: true } },
      },
    });

    if (!tipoUsuario) {
      throw new NotFoundException(`Tipo de usuário #${id} não encontrado`);
    }

    return tipoUsuario;
  }

  async update(id: number, dto: UpdateTipoUsuarioDto) {
    await this.findOne(id);

    if (dto.nome) {
      const existe = await this.prisma.tipoUsuario.findFirst({
        where: { nome: dto.nome, NOT: { id } },
      });

      if (existe) {
        throw new ConflictException(`Tipo de usuário "${dto.nome}" já existe`);
      }
    }

    if (dto.permissaoIds?.length) {
      await this.validarPermissoes(dto.permissaoIds);
    }

    return this.prisma.tipoUsuario.update({
      where: { id },
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        // Substitui todas as permissões existentes pelas novas
        permissoes: dto.permissaoIds
          ? {
              deleteMany: {},
              create: dto.permissaoIds.map((permissaoId) => ({
                permissao: { connect: { id: permissaoId } },
              })),
            }
          : undefined,
      },
      include: {
        permissoes: {
          include: {
            permissao: {
              select: { id: true, nome: true, descricao: true },
            },
          },
        },
        _count: { select: { usuarios: true } },
      },
    });
  }

  async remove(id: number): Promise<void> {
    const tipoUsuario = await this.prisma.tipoUsuario.findUnique({
      where: { id },
      include: {
        _count: { select: { usuarios: true } },
      },
    });

    if (!tipoUsuario) {
      throw new NotFoundException(`Tipo de usuário #${id} não encontrado`);
    }

    if (tipoUsuario._count.usuarios > 0) {
      throw new ConflictException(
        `Tipo de usuário "${tipoUsuario.nome}" possui ${tipoUsuario._count.usuarios} usuário(s) vinculado(s) e não pode ser excluído`,
      );
    }

    // Remove as permissões vinculadas antes de excluir o tipo
    await this.prisma.$transaction([
      this.prisma.usuarioTipoPermissao.deleteMany({
        where: { usuarioTipoId: id },
      }),
      this.prisma.tipoUsuario.delete({ where: { id } }),
    ]);
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarPermissoes(permissaoIds: number[]): Promise<void> {
    const encontradas = await this.prisma.permissao.findMany({
      where: { id: { in: permissaoIds } },
      select: { id: true },
    });

    if (encontradas.length !== permissaoIds.length) {
      const encontradasIds = encontradas.map((p) => p.id);
      const naoEncontradas = permissaoIds.filter(
        (id) => !encontradasIds.includes(id),
      );
      throw new NotFoundException(
        `Permissão(ões) não encontrada(s): ${naoEncontradas.join(', ')}`,
      );
    }
  }
}

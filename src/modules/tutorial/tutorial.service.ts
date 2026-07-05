import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tutorial } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { TutorialFiltros } from './interfaces/tutorial-filtros.interface';

@Injectable()
export class TutorialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTutorialDto): Promise<Tutorial> {
    if (dto.tipoUsuarioId) {
      await this.validarTipoUsuario(dto.tipoUsuarioId);
    }

    const existe = await this.prisma.tutorial.findFirst({
      where: { titulo: dto.titulo },
    });

    if (existe) {
      throw new ConflictException(`Tutorial "${dto.titulo}" já existe`);
    }

    return this.prisma.tutorial.create({
      data: {
        titulo: dto.titulo,
        texto: dto.texto,
        video: dto.video,
        tipoUsuarioId: dto.tipoUsuarioId,
      },
      include: {
        tipoUsuario: {
          select: { id: true, nome: true },
        },
      },
    });
  }

  async findAll(filtros: TutorialFiltros = {}) {
    const { titulo, tipoUsuarioId, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (titulo) {
      where.titulo = { contains: titulo, mode: 'insensitive' };
    }

    if (tipoUsuarioId) {
      where.tipoUsuarioId = tipoUsuarioId;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tutorial.findMany({
        where,
        orderBy: { titulo: 'asc' },
        skip,
        take: limit,
        include: {
          tipoUsuario: {
            select: { id: true, nome: true },
          },
        },
      }),
      this.prisma.tutorial.count({ where }),
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

  async findOne(id: number): Promise<Tutorial> {
    const tutorial = await this.prisma.tutorial.findUnique({
      where: { id },
      include: {
        tipoUsuario: {
          select: { id: true, nome: true, descricao: true },
        },
      },
    });

    if (!tutorial) {
      throw new NotFoundException(`Tutorial #${id} não encontrado`);
    }

    return tutorial;
  }

  async update(id: number, dto: UpdateTutorialDto): Promise<Tutorial> {
    await this.findOne(id);

    if (dto.tipoUsuarioId) {
      await this.validarTipoUsuario(dto.tipoUsuarioId);
    }

    if (dto.titulo) {
      const existe = await this.prisma.tutorial.findFirst({
        where: { titulo: dto.titulo, NOT: { id } },
      });

      if (existe) {
        throw new ConflictException(`Tutorial "${dto.titulo}" já existe`);
      }
    }

    return this.prisma.tutorial.update({
      where: { id },
      data: {
        titulo: dto.titulo,
        texto: dto.texto,
        video: dto.video,
        tipoUsuarioId: dto.tipoUsuarioId,
      },
      include: {
        tipoUsuario: {
          select: { id: true, nome: true },
        },
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.prisma.tutorial.delete({ where: { id } });
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarTipoUsuario(tipoUsuarioId: number): Promise<void> {
    const tipoUsuario = await this.prisma.tipoUsuario.findUnique({
      where: { id: tipoUsuarioId },
      select: { id: true },
    });

    if (!tipoUsuario) {
      throw new NotFoundException(
        `Tipo de usuário #${tipoUsuarioId} não encontrado`,
      );
    }
  }
}

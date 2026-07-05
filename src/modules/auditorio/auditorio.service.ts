import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuditorioDto } from './dto/create-auditorio.dto';
import { UpdateAuditorioDto } from './dto/update-auditorio.dto';

@Injectable()
export class AuditorioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAuditorioDto) {
    return this.prisma.auditorio.create({ data: dto });
  }

  async findAll() {
    return this.prisma.auditorio.findMany({
      orderBy: { nome: 'asc' },
      include: { _count: { select: { eventos: true } } },
    });
  }

  async findOne(id: number) {
    const auditorio = await this.prisma.auditorio.findUnique({
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

    if (!auditorio) {
      throw new NotFoundException(`Auditório #${id} não encontrado`);
    }

    return auditorio;
  }

  async update(id: number, dto: UpdateAuditorioDto) {
    await this.findOne(id);
    return this.prisma.auditorio.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<void> {
    const auditorio = await this.prisma.auditorio.findUnique({
      where: { id },
      include: { _count: { select: { eventos: true } } },
    });

    if (!auditorio) {
      throw new NotFoundException(`Auditório #${id} não encontrado`);
    }

    if (auditorio._count.eventos > 0) {
      throw new ConflictException(
        `Auditório "${auditorio.nome}" possui ${auditorio._count.eventos} evento(s) vinculado(s) e não pode ser excluído`,
      );
    }

    await this.prisma.auditorio.delete({ where: { id } });
  }
}

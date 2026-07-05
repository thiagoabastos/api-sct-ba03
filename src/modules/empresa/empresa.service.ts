import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaFiltros } from './interfaces/empresa-filtros.interface';

const SELECT_EMPRESA = {
  id: true,
  nome: true,
  telefone: true,
  email: true,
  valorOnibus: true,
  valorPassagem: true,
  transferenciaBancaria: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateEmpresaDto) {
    const existe = await this.prisma.empresa.findFirst({
      where: { nome: { equals: dto.nome, mode: 'insensitive' } },
    });

    if (existe) {
      throw new ConflictException(`Empresa "${dto.nome}" já está cadastrada`);
    }

    return this.prisma.empresa.create({
      data: {
        nome: dto.nome,
        telefone: dto.telefone,
        email: dto.email,
        valorOnibus: dto.valorOnibus,
        valorPassagem: dto.valorPassagem,
        transferenciaBancaria: dto.transferenciaBancaria,
      },
      select: SELECT_EMPRESA,
    });
  }

  async findAll(filtros: EmpresaFiltros = {}) {
    const { nome, page = 1, limit = 999 } = filtros;
    const skip = (page - 1) * limit;

    const where = nome
      ? { nome: { contains: nome, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.empresa.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
        select: SELECT_EMPRESA,
      }),
      this.prisma.empresa.count({ where }),
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
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      select: {
        ...SELECT_EMPRESA
      },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa #${id} não encontrada`);
    }

    return empresa;
  }

  async update(id: number, dto: UpdateEmpresaDto) {
    await this.findOne(id);

    if (dto.nome) {
      const existe = await this.prisma.empresa.findFirst({
        where: {
          nome: { equals: dto.nome, mode: 'insensitive' },
          NOT: { id },
        },
      });

      if (existe) {
        throw new ConflictException(`Empresa "${dto.nome}" já está cadastrada`);
      }
    }

    return this.prisma.empresa.update({
      where: { id },
      data: {
        nome: dto.nome,
        telefone: dto.telefone,
        email: dto.email,
        valorOnibus: dto.valorOnibus,
        valorPassagem: dto.valorPassagem,
        transferenciaBancaria: dto.transferenciaBancaria,
      },
      select: SELECT_EMPRESA,
    });
  }

  async remove(id: number): Promise<void> {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa #${id} não encontrada`);
    }

    await this.prisma.empresa.delete({ where: { id } });
  }
}

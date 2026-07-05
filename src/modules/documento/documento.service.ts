import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { DocumentoFiltros } from './interfaces/documento-filtros.interface';

@Injectable()
export class DocumentoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateDocumentoDto) {
    const existe = await this.prisma.documento.findUnique({
      where: { nome: dto.nome },
    });

    if (existe) {
      throw new ConflictException(`Já existe um documento com o nome "${dto.nome}"`);
    }

    return this.prisma.documento.create({
      data: {
        nome: dto.nome,
        url: dto.url,
      },
    });
  }

  async findAll(filtros: DocumentoFiltros = {}) {
    const { nome, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.documento.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.documento.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundException(`Documento #${id} não encontrado`);
    }

    return documento;
  }

  async update(id: number, dto: UpdateDocumentoDto) {
    const documento = await this.findOne(id);

    if (dto.nome && dto.nome !== documento.nome) {
      const existe = await this.prisma.documento.findUnique({
        where: { nome: dto.nome },
      });

      if (existe) {
        throw new ConflictException(`Já existe um documento com o nome "${dto.nome}"`);
      }
    }

    return this.prisma.documento.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.documento.delete({ where: { id } });
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFormaPagamentoDto } from './dto/create-forma-pagamento.dto';
import { UpdateFormaPagamentoDto } from './dto/update-forma-pagamento.dto';

@Injectable()
export class FormaPagamentoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateFormaPagamentoDto) {
    const existe = await this.prisma.formaPagamento.findFirst({
      where: { nome: { equals: dto.nome, mode: 'insensitive' } },
    });

    if (existe) {
      throw new ConflictException(`Forma de pagamento "${dto.nome}" já existe`);
    }

    return this.prisma.formaPagamento.create({ data: dto });
  }

  async findAll() {
    return this.prisma.formaPagamento.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: { select: { pagamentos: true } },
      },
    });
  }

  async findOne(id: number) {
    const forma = await this.prisma.formaPagamento.findUnique({
      where: { id },
      include: {
        _count: { select: { pagamentos: true } },
      },
    });

    if (!forma) {
      throw new NotFoundException(`Forma de pagamento #${id} não encontrada`);
    }

    return forma;
  }

  async update(id: number, dto: UpdateFormaPagamentoDto) {
    await this.findOne(id);

    if (dto.nome) {
      const existe = await this.prisma.formaPagamento.findFirst({
        where: {
          nome: { equals: dto.nome, mode: 'insensitive' },
          NOT: { id },
        },
      });
      if (existe) {
        throw new ConflictException(`Forma de pagamento "${dto.nome}" já existe`);
      }
    }

    return this.prisma.formaPagamento.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<void> {
    const forma = await this.prisma.formaPagamento.findUnique({
      where: { id },
      include: {
        _count: { select: { pagamentos: true } },
      },
    });

    if (!forma) {
      throw new NotFoundException(`Forma de pagamento #${id} não encontrada`);
    }

    if (forma._count.pagamentos > 0) {
      throw new ConflictException(
        `Forma de pagamento "${forma.nome}" está em uso em ${forma._count.pagamentos} pagamento(s) e não pode ser excluída`,
      );
    }

    await this.prisma.formaPagamento.delete({ where: { id } });
  }
}

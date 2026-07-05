import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pessoa } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaFiltros } from './interfaces/pessoa-filtros.interface';

const SELECT_PESSOA = {
  id: true,
  nome: true,
  createdAt: true,
  updatedAt: true,
  congregacao: {
    select: { id: true, nome: true },
  },
};

@Injectable()
export class PessoaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePessoaDto) {
    await this.validarCongregacao(dto.congregacaoId);

    const existe = await this.prisma.pessoa.findFirst({
      where: {
        nome: { equals: dto.nome, mode: 'insensitive' },
        congregacaoId: dto.congregacaoId,
      },
    });

    if (existe) {
      throw new ConflictException(
        `Já existe uma pessoa com o nome "${dto.nome}" nessa congregação`,
      );
    }

    return this.prisma.pessoa.create({
      data: {
        nome: dto.nome,
        congregacao: { connect: { id: dto.congregacaoId } },
      },
      select: SELECT_PESSOA,
    });
  }

  async findAll(filtros: PessoaFiltros = {}) {
    const { nome, congregacaoId, page = 1, limit = 999 } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(congregacaoId && { congregacaoId }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.pessoa.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
        select: SELECT_PESSOA,
      }),
      this.prisma.pessoa.count({ where }),
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

    return this.prisma.pessoa.findMany({
      where: { congregacaoId },
      orderBy: { nome: 'asc' },
      select: SELECT_PESSOA,
    });
  }

  async findOne(id: number) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id },
      select: {
        ...SELECT_PESSOA,
        // Histórico de arranjos em que a pessoa participou
        nomesArranjo: {
          select: {
            id: true,
            menorIdade: true,
            sexta: true,
            sabado: true,
            domingo: true,
            arranjoCongregacao: {
              select: {
                id: true,
                status: true,
                evento: {
                  select: {
                    id: true,
                    ano: true,
                    dataEvento: true,
                    eventoTipo: { select: { id: true, nome: true, tipo: true } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { nomesArranjo: true },
        },
      },
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa #${id} não encontrada`);
    }

    return pessoa;
  }

  async update(id: number, dto: UpdatePessoaDto) {
    const pessoa = await this.prisma.pessoa.findUnique({ where: { id } });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa #${id} não encontrada`);
    }

    if (dto.congregacaoId) {
      await this.validarCongregacao(dto.congregacaoId);
    }

    const congregacaoId = dto.congregacaoId ?? pessoa.congregacaoId;
    const nome = dto.nome ?? pessoa.nome;

    // Verifica duplicidade de nome na congregação (ignora o próprio registro)
    const existe = await this.prisma.pessoa.findFirst({
      where: {
        nome: { equals: nome, mode: 'insensitive' },
        congregacaoId,
        NOT: { id },
      },
    });

    if (existe) {
      throw new ConflictException(
        `Já existe uma pessoa com o nome "${nome}" nessa congregação`,
      );
    }

    return this.prisma.pessoa.update({
      where: { id },
      data: {
        nome: dto.nome,
        ...(dto.congregacaoId && {
          congregacao: { connect: { id: dto.congregacaoId } },
        }),
      },
      select: SELECT_PESSOA,
    });
  }

  async remove(id: number): Promise<void> {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id },
      include: {
        _count: { select: { nomesArranjo: true } },
      },
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa #${id} não encontrada`);
    }

    if (pessoa._count.nomesArranjo > 0) {
      throw new ConflictException(
        `Pessoa "${pessoa.nome}" possui ${pessoa._count.nomesArranjo} registro(s) em arranjos e não pode ser excluída`,
      );
    }

    await this.prisma.pessoa.delete({ where: { id } });
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarCongregacao(id: number): Promise<void> {
    const existe = await this.prisma.congregacao.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Congregação #${id} não encontrada`);
    }
  }
}

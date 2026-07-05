import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNomeArranjoCongregacaoDto } from './dto/create-nome-arranjo-congregacao.dto';
import { UpdateNomeArranjoCongregacaoDto } from './dto/update-nome-arranjo-congregacao.dto';
import { NomeArranjoCongregacaoFiltros } from './interfaces/nome-arranjo-filtros.interface';

const SELECT_NOME = {
  id: true,
  menorIdade: true,
  sexta: true,
  sabado: true,
  domingo: true,
  carro: true,
  carroSexta: true,
  carroSabado: true,
  carroDomingo: true,
  ida: true,
  idaSexta: true,
  idaSabado: true,
  idaDomingo: true,
  volta: true,
  voltaSexta: true,
  voltaSabado: true,
  voltaDomingo: true,
  observacao: true,
  observacaoSexta: true,
  observacaoSabado: true,
  observacaoDomingo: true,
  createdAt: true,
  updatedAt: true,
  pessoa: {
    select: { id: true, nome: true },
  },
  arranjoCongregacao: {
    select: {
      id: true,
      status: true,
      congregacao: { select: { id: true, nome: true } },
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
};

@Injectable()
export class NomeArranjoCongregacaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateNomeArranjoCongregacaoDto) {
    await this.validarArranjo(dto.arranjoCongregacaoId);
    await this.validarPessoa(dto.pessoaId);

    const existe = await this.prisma.nomeArranjoCongregacao.findFirst({
      where: {
        arranjoCongregacaoId: dto.arranjoCongregacaoId,
        pessoaId: dto.pessoaId,
      },
    });

    if (existe) {
      throw new ConflictException('Pessoa já está cadastrada neste arranjo');
    }

    return this.prisma.nomeArranjoCongregacao.create({
      data: {
        arranjoCongregacao: { connect: { id: dto.arranjoCongregacaoId } },
        pessoa: { connect: { id: dto.pessoaId } },
        menorIdade: dto.menorIdade,
        sexta: dto.sexta,
        sabado: dto.sabado,
        domingo: dto.domingo,
        carro: dto.carro,
        carroSexta: dto.carroSexta,
        carroSabado: dto.carroSabado,
        carroDomingo: dto.carroDomingo,
        ida: dto.ida,
        idaSexta: dto.idaSexta,
        idaSabado: dto.idaSabado,
        idaDomingo: dto.idaDomingo,
        volta: dto.volta,
        voltaSexta: dto.voltaSexta,
        voltaSabado: dto.voltaSabado,
        voltaDomingo: dto.voltaDomingo,
        observacao: dto.observacao,
        observacaoSexta: dto.observacaoSexta,
        observacaoSabado: dto.observacaoSabado,
        observacaoDomingo: dto.observacaoDomingo,
      },
      select: SELECT_NOME,
    });
  }

  async findAll(filtros: NomeArranjoCongregacaoFiltros = {}) {
    const {
      arranjoCongregacaoId,
      pessoaId,
      menorIdade,
      sexta,
      sabado,
      domingo,
      page = 1,
      limit = 50,
    } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(arranjoCongregacaoId && { arranjoCongregacaoId }),
      ...(pessoaId && { pessoaId }),
      ...(menorIdade !== undefined && { menorIdade }),
      ...(sexta !== undefined && { sexta }),
      ...(sabado !== undefined && { sabado }),
      ...(domingo !== undefined && { domingo }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.nomeArranjoCongregacao.findMany({
        where,
        orderBy: { pessoa: { nome: 'asc' } },
        skip,
        take: limit,
        select: SELECT_NOME,
      }),
      this.prisma.nomeArranjoCongregacao.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByArranjo(arranjoCongregacaoId: number) {
    await this.validarArranjo(arranjoCongregacaoId);

    const nomes = await this.prisma.nomeArranjoCongregacao.findMany({
      where: { arranjoCongregacaoId },
      orderBy: { pessoa: { nome: 'asc' } },
      select: SELECT_NOME,
    });

    // Agrupa por dia para facilitar a montagem da lista no front
    const porDia = {
      sexta: nomes.filter((n) => n.sexta),
      sabado: nomes.filter((n) => n.sabado),
      domingo: nomes.filter((n) => n.domingo),
    };

    return {
      total: nomes.length,
      menoresDeIdade: nomes.filter((n) => n.menorIdade).length,
      porDia,
      nomes,
    };
  }

  async findOne(id: number) {
    const nome = await this.prisma.nomeArranjoCongregacao.findUnique({
      where: { id },
      select: SELECT_NOME,
    });

    if (!nome) {
      throw new NotFoundException(`Nome de arranjo #${id} não encontrado`);
    }

    return nome;
  }

  async update(id: number, dto: UpdateNomeArranjoCongregacaoDto) {
    await this.findOne(id);

    return this.prisma.nomeArranjoCongregacao.update({
      where: { id },
      data: {
        menorIdade: dto.menorIdade,
        sexta: dto.sexta,
        sabado: dto.sabado,
        domingo: dto.domingo,
        carro: dto.carro,
        carroSexta: dto.carroSexta,
        carroSabado: dto.carroSabado,
        carroDomingo: dto.carroDomingo,
        ida: dto.ida,
        idaSexta: dto.idaSexta,
        idaSabado: dto.idaSabado,
        idaDomingo: dto.idaDomingo,
        volta: dto.volta,
        voltaSexta: dto.voltaSexta,
        voltaSabado: dto.voltaSabado,
        voltaDomingo: dto.voltaDomingo,
        observacao: dto.observacao,
        observacaoSexta: dto.observacaoSexta,
        observacaoSabado: dto.observacaoSabado,
        observacaoDomingo: dto.observacaoDomingo,
      },
      select: SELECT_NOME,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.nomeArranjoCongregacao.delete({ where: { id } });
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarArranjo(id: number): Promise<void> {
    const existe = await this.prisma.arranjoCongregacao.findUnique({
      where: { id },
    });
    if (!existe) {
      throw new NotFoundException(`Arranjo #${id} não encontrado`);
    }
  }

  private async validarPessoa(id: number): Promise<void> {
    const existe = await this.prisma.pessoa.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Pessoa #${id} não encontrada`);
    }
  }
}

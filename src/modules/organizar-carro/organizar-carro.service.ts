import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizarCarroDto } from './dto/create-organizar-carro.dto';
import { UpdateOrganizarCarroDto } from './dto/update-organizar-carro.dto';
import { OrganizarCarroFiltros } from './interfaces/organizar-carro-filtros.interface';

const SELECT_ORGANIZAR_CARRO = {
  id: true,
  carro: true,
  dia: true,
  createdAt: true,
  updatedAt: true,
  capitao: {
    select: { id: true, nome: true, celular: true },
  },
  evento: {
    select: {
      id: true,
      ano: true,
      dataEvento: true,
      eventoTipo: { select: { id: true, nome: true, tipo: true } },
    },
  },
  congregacao: {
    select: { id: true, nome: true },
  },
  apanhas: {
    select: {
      apanha: {
        select: { id: true, local: true },
      },
    },
  },
  _count: {
    select: { controlesQualidade: true },
  },
};

@Injectable()
export class OrganizarCarroService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateOrganizarCarroDto) {
    await this.validarCapitao(dto.capitaoId);
    await this.validarEvento(dto.eventoId);
    await this.validarCongregacao(dto.congregacaoId);

    if (dto.apanhaIds?.length) {
      await this.validarApanhas(dto.apanhaIds);
    }

    // Verifica duplicidade: mesmo capitão, evento, congregação e dia
    if (dto.dia) {
      const existe = await this.prisma.organizarCarro.findFirst({
        where: {
          capitaoId: dto.capitaoId,
          eventoId: dto.eventoId,
          congregacaoId: dto.congregacaoId,
          dia: dto.dia,
          carro: dto.carro,
        },
      });

      if (existe) {
        throw new ConflictException(
          'Já existe uma organização de carro com os mesmos dados para este dia',
        );
      }
    }

    const { apanhaIds, capitaoId, eventoId, congregacaoId, ...dadosCarro } = dto;

    return this.prisma.organizarCarro.create({
      data: {
        ...dadosCarro,
        capitao: { connect: { id: dto.capitaoId } },
        evento: { connect: { id: dto.eventoId } },
        congregacao: { connect: { id: dto.congregacaoId } },
        apanhas: apanhaIds?.length
          ? {
            create: apanhaIds.map((apanhaId) => ({
              apanha: { connect: { id: apanhaId } },
            })),
          }
          : undefined,
      },
      select: SELECT_ORGANIZAR_CARRO,
    });
  }

  async findAll(filtros: OrganizarCarroFiltros = {}) {
    const { eventoId, congregacaoId, capitaoId, dia, page = 1, limit = 20 } =
      filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(eventoId && { eventoId }),
      ...(congregacaoId && { congregacaoId }),
      ...(capitaoId && { capitaoId }),
      ...(dia && { dia }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.organizarCarro.findMany({
        where,
        orderBy: [{ dia: 'asc' }, { carro: 'asc' }],
        skip,
        take: limit,
        select: SELECT_ORGANIZAR_CARRO,
      }),
      this.prisma.organizarCarro.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByEvento(eventoId: number) {
    await this.validarEvento(eventoId);

    const carros = await this.prisma.organizarCarro.findMany({
      where: { eventoId },
      orderBy: [{ dia: 'asc' }, { carro: 'asc' }],
      select: SELECT_ORGANIZAR_CARRO,
    });

    // Agrupa por dia para facilitar montagem de escala no front
    const porDia = carros.reduce(
      (acc, carro) => {
        const dia = carro.dia ?? 'sem_dia';
        if (!acc[dia]) acc[dia] = [];
        acc[dia].push(carro);
        return acc;
      },
      {} as Record<string, typeof carros>,
    );

    return {
      total: carros.length,
      porDia,
      carros,
    };
  }

  async findOne(id: number) {
    const carro = await this.prisma.organizarCarro.findUnique({
      where: { id },
      select: {
        ...SELECT_ORGANIZAR_CARRO,

        controlesQualidade: {
          select: {
            id: true,
            empresa: true,
            placa: true,
            numeroOnibus: true,
            motorista: true,
            telefoneMotorista: true,
            aparenciaMotorista: true,
            educacao: true,
            condicaoPneus: true,
            limpezaCarro: true,
            extintorIncendioDisponivel: true,
            problemasQuantoHorario: true,
            pontosEmbarqueProblemas: true,
            trafegouAcostamento: true,
            velocidadeTrafegou: true,
            informacoesAdicionaisSugestoes: true,
          },
        },
      },
    });

    if (!carro) {
      throw new NotFoundException(`Organização de carro #${id} não encontrada`);
    }

    return carro;
  }

  async update(id: number, dto: UpdateOrganizarCarroDto) {
    await this.findOne(id);

    if (dto.capitaoId) await this.validarCapitao(dto.capitaoId);
    if (dto.eventoId) await this.validarEvento(dto.eventoId);
    if (dto.congregacaoId) await this.validarCongregacao(dto.congregacaoId);
    if (dto.apanhaIds?.length) await this.validarApanhas(dto.apanhaIds);

    const { apanhaIds, ...dadosCarro } = dto;

    return this.prisma.organizarCarro.update({
      where: { id },
      data: {
        carro: dadosCarro.carro,
        dia: dadosCarro.dia,
        ...(dadosCarro.capitaoId && {
          capitao: { connect: { id: dadosCarro.capitaoId } },
        }),
        ...(dadosCarro.eventoId && {
          evento: { connect: { id: dadosCarro.eventoId } },
        }),
        ...(dadosCarro.congregacaoId && {
          congregacao: { connect: { id: dadosCarro.congregacaoId } },
        }),
        // Substitui pontos de apanha
        apanhas: apanhaIds
          ? {
            deleteMany: {},
            create: apanhaIds.map((apanhaId) => ({
              apanha: { connect: { id: apanhaId } },
            })),
          }
          : undefined,
      },
      select: SELECT_ORGANIZAR_CARRO,
    });
  }

  async adicionarApanha(id: number, apanhaId: number) {
    await this.findOne(id);
    await this.validarApanhas([apanhaId]);

    const jaVinculada = await this.prisma.organizarCarroApanha.findFirst({
      where: { organizarCarroId: id, apanhaId },
    });

    if (jaVinculada) {
      throw new ConflictException('Ponto de apanha já está vinculado a este carro');
    }

    return this.prisma.organizarCarroApanha.create({
      data: {
        organizarCarro: { connect: { id } },
        apanha: { connect: { id: apanhaId } },
      },
      select: {
        apanha: { select: { id: true, local: true } },
        organizarCarro: { select: { id: true, carro: true, dia: true } },
      },
    });
  }

  async removerApanha(id: number, apanhaId: number): Promise<void> {
    const vinculo = await this.prisma.organizarCarroApanha.findFirst({
      where: { organizarCarroId: id, apanhaId },
    });

    if (!vinculo) {
      throw new NotFoundException('Ponto de apanha não está vinculado a este carro');
    }

    await this.prisma.organizarCarroApanha.deleteMany({
      where: { organizarCarroId: id, apanhaId },
    });
  }

  async remove(id: number): Promise<void> {
    const carro = await this.prisma.organizarCarro.findUnique({
      where: { id },
      include: {
        _count: {
          select: { controlesQualidade: true },
        },
      },
    });

    if (!carro) {
      throw new NotFoundException(`Organização de carro #${id} não encontrada`);
    }

    await this.prisma.$transaction([
      this.prisma.organizarCarroApanha.deleteMany({
        where: { organizarCarroId: id },
      }),

      this.prisma.controleQualidade.deleteMany({
        where: { organizarCarroId: id },
      }),
      this.prisma.organizarCarro.delete({ where: { id } }),
    ]);
  }

  // ----------------------------------------------------------------
  // Helpers privados
  // ----------------------------------------------------------------

  private async validarCapitao(id: number): Promise<void> {
    const existe = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException(`Capitão (usuário) #${id} não encontrado`);
  }

  private async validarEvento(id: number): Promise<void> {
    const existe = await this.prisma.evento.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException(`Evento #${id} não encontrado`);
  }

  private async validarCongregacao(id: number): Promise<void> {
    const existe = await this.prisma.congregacao.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException(`Congregação #${id} não encontrada`);
  }

  private async validarApanhas(ids: number[]): Promise<void> {
    const encontradas = await this.prisma.apanha.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (encontradas.length !== ids.length) {
      const encontradasIds = encontradas.map((a) => a.id);
      const naoEncontradas = ids.filter((id) => !encontradasIds.includes(id));
      throw new NotFoundException(
        `Ponto(s) de apanha não encontrado(s): ${naoEncontradas.join(', ')}`,
      );
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateControleQualidadeDto } from './dto/create-controle-qualidade.dto';
import { UpdateControleQualidadeDto } from './dto/update-controle-qualidade.dto';
import { ControleQualidadeFiltros } from './interfaces/controle-qualidade-filtros.interface';

const SELECT_CONTROLE_QUALIDADE = {
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
  createdAt: true,
  updatedAt: true,
  organizarCarro: {
    select: {
      id: true,
      carro: true,
      dia: true,
      evento: { select: { id: true, ano: true } },
    },
  },
};

@Injectable()
export class ControleQualidadeService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateControleQualidadeDto) {
    await this.validarOrganizarCarro(dto.organizarCarroId);

    return this.prisma.controleQualidade.create({
      data: {
        empresa: dto.empresa,
        placa: dto.placa,
        numeroOnibus: dto.numeroOnibus,
        motorista: dto.motorista,
        telefoneMotorista: dto.telefoneMotorista,
        aparenciaMotorista: dto.aparenciaMotorista,
        educacao: dto.educacao,
        condicaoPneus: dto.condicaoPneus,
        limpezaCarro: dto.limpezaCarro,
        extintorIncendioDisponivel: dto.extintorIncendioDisponivel,
        problemasQuantoHorario: dto.problemasQuantoHorario,
        pontosEmbarqueProblemas: dto.pontosEmbarqueProblemas,
        trafegouAcostamento: dto.trafegouAcostamento,
        velocidadeTrafegou: dto.velocidadeTrafegou,
        informacoesAdicionaisSugestoes: dto.informacoesAdicionaisSugestoes,
        organizarCarro: { connect: { id: dto.organizarCarroId } },
      },
      select: SELECT_CONTROLE_QUALIDADE,
    });
  }

  async findAll(filtros: ControleQualidadeFiltros = {}) {
    const { organizarCarroId, motorista, empresa, page = 1, limit = 20 } =
      filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(organizarCarroId && { organizarCarroId }),
      ...(motorista && {
        motorista: { contains: motorista, mode: 'insensitive' as const },
      }),
      ...(empresa && {
        empresa: { contains: empresa, mode: 'insensitive' as const },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.controleQualidade.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: SELECT_CONTROLE_QUALIDADE,
      }),
      this.prisma.controleQualidade.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const controle = await this.prisma.controleQualidade.findUnique({
      where: { id },
      select: SELECT_CONTROLE_QUALIDADE,
    });

    if (!controle) {
      throw new NotFoundException(`Controle de qualidade #${id} não encontrado`);
    }

    return controle;
  }

  async update(id: number, dto: UpdateControleQualidadeDto) {
    await this.findOne(id);

    if (dto.organizarCarroId) {
      await this.validarOrganizarCarro(dto.organizarCarroId);
    }

    return this.prisma.controleQualidade.update({
      where: { id },
      data: {
        empresa: dto.empresa,
        placa: dto.placa,
        numeroOnibus: dto.numeroOnibus,
        motorista: dto.motorista,
        telefoneMotorista: dto.telefoneMotorista,
        aparenciaMotorista: dto.aparenciaMotorista,
        educacao: dto.educacao,
        condicaoPneus: dto.condicaoPneus,
        limpezaCarro: dto.limpezaCarro,
        extintorIncendioDisponivel: dto.extintorIncendioDisponivel,
        problemasQuantoHorario: dto.problemasQuantoHorario,
        pontosEmbarqueProblemas: dto.pontosEmbarqueProblemas,
        trafegouAcostamento: dto.trafegouAcostamento,
        velocidadeTrafegou: dto.velocidadeTrafegou,
        informacoesAdicionaisSugestoes: dto.informacoesAdicionaisSugestoes,
        ...(dto.organizarCarroId && {
          organizarCarro: { connect: { id: dto.organizarCarroId } },
        }),
      },
      select: SELECT_CONTROLE_QUALIDADE,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.controleQualidade.delete({ where: { id } });
  }

  private async validarOrganizarCarro(id: number): Promise<void> {
    const existe = await this.prisma.organizarCarro.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Organização de carro #${id} não encontrada`);
    }
  }
}

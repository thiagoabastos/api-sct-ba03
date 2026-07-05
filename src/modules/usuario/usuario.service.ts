import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateSenhaDto } from './dto/update-senha.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioFiltros, UsuarioLogado } from './interfaces/usuario-filtros.interface';

const SALT_ROUNDS = 10;

// Campos retornados — senha nunca é exposta
const SELECT_USUARIO = {
  id: true,
  nome: true,
  email: true,
  celular: true,
  senhaCreate: true,
  createdAt: true,
  updatedAt: true,
  congregacao: { select: { id: true, nome: true } },
  tipoUsuario: {
    select: {
      id: true,
      nome: true,
      descricao: true,
      permissoes: {
        include: {
          permissao: { select: { id: true, nome: true } },
        },
      },
    },
  },
};

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    await this.validarCongregacao(dto.congregacaoId);
    await this.validarTipoUsuario(dto.tipoUsuarioId);

    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException(`E-mail "${dto.email}" já está em uso`);
    }

    const senhaHash = await bcrypt.hash(dto.senha, SALT_ROUNDS);

    return this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        celular: dto.celular,
        senha: senhaHash,
        senhaCreate: new Date(),
        congregacao: { connect: { id: dto.congregacaoId } },
        tipoUsuario: { connect: { id: dto.tipoUsuarioId } },
      },
      select: SELECT_USUARIO,
    });
  }

  async findAll(filtros: UsuarioFiltros = {}) {
    const { nome, email, congregacaoId, tipoUsuarioId, page = 1, limit = 20 } = filtros;
    const skip = (page - 1) * limit;

    const where = {
      ...(nome && { nome: { contains: nome, mode: 'insensitive' as const } }),
      ...(email && { email: { contains: email, mode: 'insensitive' as const } }),
      ...(congregacaoId && { congregacaoId }),
      ...(tipoUsuarioId && { tipoUsuarioId }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: limit,
        select: SELECT_USUARIO,
      }),
      this.prisma.usuario.count({ where }),
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
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: SELECT_USUARIO,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário #${id} não encontrado`);
    }

    return usuario;
  }

  async findPerfil(usuarioLogado: UsuarioLogado) {
    return this.findOne(usuarioLogado.id);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);

    if (dto.congregacaoId) await this.validarCongregacao(dto.congregacaoId);
    if (dto.tipoUsuarioId) await this.validarTipoUsuario(dto.tipoUsuarioId);

    if (dto.email) {
      const existe = await this.prisma.usuario.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (existe) {
        throw new ConflictException(`E-mail "${dto.email}" já está em uso`);
      }
    }

    return this.prisma.usuario.update({
      where: { id },
      data: {
        nome: dto.nome,
        email: dto.email,
        celular: dto.celular,
        ...(dto.congregacaoId && {
          congregacao: { connect: { id: dto.congregacaoId } },
        }),
        ...(dto.tipoUsuarioId && {
          tipoUsuario: { connect: { id: dto.tipoUsuarioId } },
        }),
      },
      select: SELECT_USUARIO,
    });
  }

  async updateSenha(id: number, dto: UpdateSenhaDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: { id: true, senha: true },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário #${id} não encontrado`);
    }

    if (!usuario.senha) {
      throw new BadRequestException('Usuário não possui senha cadastrada');
    }

    const senhaCorreta = await bcrypt.compare(dto.senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const mesmaSenha = await bcrypt.compare(dto.novaSenha, usuario.senha);
    if (mesmaSenha) {
      throw new BadRequestException('A nova senha não pode ser igual à senha atual');
    }

    const senhaHash = await bcrypt.hash(dto.novaSenha, SALT_ROUNDS);

    await this.prisma.usuario.update({
      where: { id },
      data: { senha: senhaHash, senhaCreate: new Date() },
    });

    return { message: 'Senha atualizada com sucesso' };
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.usuario.delete({ where: { id } });
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

  private async validarTipoUsuario(id: number): Promise<void> {
    const existe = await this.prisma.tipoUsuario.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`Tipo de usuário #${id} não encontrado`);
    }
  }
}

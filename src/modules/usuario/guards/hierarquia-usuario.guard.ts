import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HIERARQUIA_CRIACAO } from '../usuario.constants';

@Injectable()
export class HierarquiaUsuarioGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const usuarioLogado = request.user;
    const body = request.body;

    // Busca o tipo do usuário logado
    const tipoLogado = await this.prisma.tipoUsuario.findUnique({
      where: { id: usuarioLogado.tipoUsuarioId },
      select: { nome: true },
    });

    if (!tipoLogado) {
      throw new ForbiddenException('Tipo de usuário não encontrado');
    }

    const tiposPermitidos = HIERARQUIA_CRIACAO[tipoLogado.nome] ?? [];

    if (tiposPermitidos.length === 0) {
      throw new ForbiddenException(
        `Perfil "${tipoLogado.nome}" não tem permissão para criar usuários`,
      );
    }

    // Busca o tipo do usuário que está sendo criado/atualizado
    if (body.tipoUsuarioId) {
      const tipoCriado = await this.prisma.tipoUsuario.findUnique({
        where: { id: body.tipoUsuarioId },
        select: { nome: true },
      });

      if (!tipoCriado) {
        throw new ForbiddenException('Tipo de usuário de destino não encontrado');
      }

      if (!tiposPermitidos.includes(tipoCriado.nome)) {
        throw new ForbiddenException(
          `Perfil "${tipoLogado.nome}" não pode criar usuários do tipo "${tipoCriado.nome}"`,
        );
      }
    }

    return true;
  }
}

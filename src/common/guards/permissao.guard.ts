import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSAO_KEY } from '../decorators/permissao.decorator';

@Injectable()
export class PermissaoGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const permissoesNecessarias = this.reflector.getAllAndOverride<string[]>(
            PERMISSAO_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Rota sem @Permissao() — apenas exige token válido
        if (!permissoesNecessarias || permissoesNecessarias.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const temPermissao = permissoesNecessarias.some((p) =>
            user?.permissoes?.includes(p),
        );

        if (!temPermissao) {
            throw new ForbiddenException('Sem permissão para acessar este recurso');
        }

        return true;
    }
}
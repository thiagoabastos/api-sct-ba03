import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
            include: {
                tipoUsuario: {
                    include: {
                        permissoes: {
                            include: { permissao: true },
                        },
                    },
                },
                congregacao: true,
            },
        });

        if (!usuario || !usuario.senha) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const permissoes = usuario.tipoUsuario.permissoes.map(
            (p) => p.permissao.nome,
        );

        const payload = {
            sub: usuario.id,
            email: usuario.email,
            tipoUsuarioId: usuario.tipoUsuarioId,
            permissoes,
        };

        const token = this.jwtService.sign(payload);

        // Retorna token + dados do usuário (sem a senha)
        const { senha, ...dadosUsuario } = usuario;

        return {
            access_token: token,
            usuario: {
                ...dadosUsuario,
                permissoes,
            },
        };
    }
}
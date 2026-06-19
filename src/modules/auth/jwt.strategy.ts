import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
    sub: number;
    email: string;
    tipoUsuarioId: number;
    permissoes: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET as string,
        });
    }

    async validate(payload: JwtPayload) {
        // O que retornar aqui fica disponível em req.user
        return {
            id: payload.sub,
            email: payload.email,
            tipoUsuarioId: payload.tipoUsuarioId,
            permissoes: payload.permissoes, // array de nomes de permissão
        };
    }
}
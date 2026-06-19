import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCongregacaoDto {
    @IsString({ message: 'Nome deve ser uma string' })
    @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
    @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
    nome: string;
}

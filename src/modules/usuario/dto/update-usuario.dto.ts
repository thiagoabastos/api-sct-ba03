import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Celular deve ser uma string' })
  @MaxLength(15, { message: 'Celular deve ter no máximo 15 caracteres' })
  celular?: string;

  @IsOptional()
  @IsInt({ message: 'congregacaoId deve ser um número inteiro' })
  congregacaoId?: number;

  @IsOptional()
  @IsInt({ message: 'tipoUsuarioId deve ser um número inteiro' })
  tipoUsuarioId?: number;
}

import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNotEmpty
} from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Celular deve ser uma string' })
  @MaxLength(15, { message: 'Celular deve ter no máximo 15 caracteres' })
  celular?: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(255, { message: 'Senha deve ter no máximo 255 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  })
  senha: string;

  @IsNotEmpty({ message: 'congregacaoId é obrigatório' })
  @IsInt({ message: 'congregacaoId deve ser um número inteiro' })
  congregacaoId: number;

  @IsNotEmpty({ message: 'tipoUsuarioId é obrigatório' })
  @IsInt({ message: 'tipoUsuarioId deve ser um número inteiro' })
  tipoUsuarioId: number;
}

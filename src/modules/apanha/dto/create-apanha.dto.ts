import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateApanhaDto {
  @IsNotEmpty({ message: 'Local é obrigatório' })
  @IsString({ message: 'Local deve ser uma string' })
  @MinLength(2, { message: 'Local deve ter no mínimo 2 caracteres' })
  @MaxLength(200, { message: 'Local deve ter no máximo 200 caracteres' })
  local: string;

  @IsNotEmpty({ message: 'congregacaoId é obrigatório' })
  @IsInt({ message: 'congregacaoId deve ser um número inteiro' })
  congregacaoId: number;
}

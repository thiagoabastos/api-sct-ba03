import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateApanhaDto {
  @IsString({ message: 'Local deve ser uma string' })
  @MinLength(2, { message: 'Local deve ter no mínimo 2 caracteres' })
  @MaxLength(200, { message: 'Local deve ter no máximo 200 caracteres' })
  local: string;

  @IsInt({ message: 'congregacaoId deve ser um número inteiro' })
  congregacaoId: number;
}

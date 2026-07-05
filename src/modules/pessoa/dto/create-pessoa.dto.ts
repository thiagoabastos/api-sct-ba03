import { IsInt, IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreatePessoaDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'congregacaoId é obrigatório' })
  @IsInt({ message: 'congregacaoId deve ser um número inteiro' })
  congregacaoId: number;
}

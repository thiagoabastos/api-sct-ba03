import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty
} from 'class-validator';

export class CreateTipoUsuarioDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(20, { message: 'Nome deve ter no máximo 20 caracteres' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  descricao?: string;

  @IsOptional()
  @IsArray({ message: 'permissaoIds deve ser um array' })
  @ArrayMinSize(1, { message: 'Informe ao menos uma permissão' })
  @IsInt({ each: true, message: 'Cada permissaoId deve ser um número inteiro' })
  permissaoIds?: number[];
}

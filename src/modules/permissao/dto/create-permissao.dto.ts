import { IsOptional, IsString, Matches, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreatePermissaoDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  @Matches(/^[a-z]+(_[a-z]+)*$/, {
    message: 'Nome deve seguir o padrão snake_case (ex: congregacao_ver)',
  })
  nome: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  descricao?: string;
}

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTutorialDto {
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  @MinLength(2, { message: 'Título deve ter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Título deve ter no máximo 50 caracteres' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'Texto deve ser uma string' })
  @MaxLength(500, { message: 'Texto deve ter no máximo 500 caracteres' })
  texto?: string;

  @IsOptional()
  @IsString({ message: 'Vídeo deve ser uma string' })
  @IsUrl({}, { message: 'Vídeo deve ser uma URL válida' })
  @MaxLength(300, { message: 'URL do vídeo deve ter no máximo 300 caracteres' })
  video?: string;

  @IsOptional()
  @IsInt({ message: 'tipoUsuarioId deve ser um número inteiro' })
  tipoUsuarioId?: number;
}

import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { TipoEvento } from '@prisma/client';

export class CreateEventoTipoDto {
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(60, { message: 'Nome deve ter no máximo 60 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'Tipo não pode ser vazio' })
  @IsEnum(TipoEvento, {
    message: `Tipo deve ser um dos valores: ${Object.values(TipoEvento).join(', ')}`,
  })
  tipo: TipoEvento;

  @IsNotEmpty({ message: 'Horário não pode ser vazio' })
  @IsString({ message: 'Horário deve ser uma string' })
  @MaxLength(5, { message: 'Horário deve ter no máximo 5 caracteres' })
  horario: string;
}

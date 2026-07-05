import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAuditorioDto {
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(1, { message: 'Nome deve ter no mínimo 1 caractere' })
  @MaxLength(2, { message: 'Nome deve ter no máximo 2 caracteres' })
  nome: string;

  @IsString({ message: 'Fuso horário deve ser uma string' })
  @MaxLength(2, { message: 'Fuso horário deve ter no máximo 2 caracteres' })
  fusoHorario: string;
}

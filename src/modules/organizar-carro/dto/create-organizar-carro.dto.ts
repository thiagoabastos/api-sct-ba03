import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum DiaSemana {
  SEXTA = 'Sexta',
  SABADO = 'Sábado',
  DOMINGO = 'Domingo',
}

export class CreateOrganizarCarroDto {
  @IsInt({ message: 'capitaoId deve ser um número inteiro' })
  capitaoId: number;

  @IsInt({ message: 'eventoId deve ser um número inteiro' })
  eventoId: number;

  @IsInt({ message: 'congregacaoId deve ser um número inteiro' })
  congregacaoId: number;

  @IsOptional()
  @IsString({ message: 'carro deve ser uma string' })
  @MaxLength(2, { message: 'carro deve ter no máximo 2 caracteres (ex: 01)' })
  carro?: string;

  @IsOptional()
  @IsEnum(DiaSemana, {
    message: `dia deve ser: ${Object.values(DiaSemana).join(', ')}`,
  })
  dia?: DiaSemana;

  @IsOptional()
  @IsArray({ message: 'apanhaIds deve ser um array' })
  @ArrayMinSize(1, { message: 'Informe ao menos um ponto de apanha' })
  @IsInt({ each: true, message: 'Cada apanhaId deve ser um número inteiro' })
  apanhaIds?: number[];
}

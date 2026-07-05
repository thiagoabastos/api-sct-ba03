import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { StatusPagamento } from '@prisma/client';

export class CreateArranjoCongregacaoDto {
  @IsNotEmpty({ message: 'congregacaoId é obrigatório' })
  @IsInt({ message: 'congregacaoId deve ser um número inteiro' })
  congregacaoId: number;

  @IsNotEmpty({ message: 'eventoId é obrigatório' })
  @IsInt({ message: 'eventoId deve ser um número inteiro' })
  eventoId: number;

  @IsOptional()
  @IsEnum(StatusPagamento, {
    message: `Status deve ser: ${Object.values(StatusPagamento).join(', ')}`,
  })
  status?: StatusPagamento;

  @IsOptional()
  @IsDateString({}, { message: 'dataPago inválida (use formato ISO: YYYY-MM-DD)' })
  dataPago?: string;

  @IsOptional()
  @IsString({ message: 'Observações deve ser uma string' })
  @MaxLength(250, { message: 'Observações deve ter no máximo 250 caracteres' })
  observacoes?: string;

  @IsOptional()
  @IsInt({ message: 'criadoPorId deve ser um número inteiro' })
  criadoPorId?: number;

  @IsOptional()
  @IsInt({ message: 'atualizadoPorId deve ser um número inteiro' })
  atualizadoPorId?: number;
}

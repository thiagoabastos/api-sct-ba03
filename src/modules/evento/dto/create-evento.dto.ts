import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateEventoDto {
  @IsNotEmpty({ message: 'eventoTipoId não pode ser vazio' })
  @IsInt({ message: 'eventoTipoId deve ser um número inteiro' })
  eventoTipoId: number;

  @IsOptional()
  @IsInt({ message: 'auditorioId deve ser um número inteiro' })
  auditorioId?: number;

  @IsNotEmpty({ message: 'Ano não pode ser vazio' })
  @IsString({ message: 'Ano deve ser uma string' })
  @Length(4, 4, { message: 'Ano deve ter exatamente 4 caracteres' })
  @Matches(/^\d{4}$/, { message: 'Ano deve conter apenas dígitos (ex: 2025)' })
  ano: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '1,2', force_decimal: false },
    { message: 'Valor deve ser um decimal válido (ex: 150.00)' },
  )
  valor?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Data do evento inválida (use formato ISO: YYYY-MM-DD)' })
  dataEvento?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data limite de nome inválida' })
  dataLimiteNome?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data limite de pagamento inválida' })
  dataLimitePagamento?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data limite de depósito inválida' })
  dataLimiteDeposito?: string;

  @IsOptional()
  @IsString({ message: 'Horário de saída do ônibus deve ser uma string' })
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'Horário de saída do ônibus deve estar no formato HH:MM',
  })
  horarioSaidaOnibus?: string;

  @IsOptional()
  @IsArray({ message: 'congregacaoIds deve ser um array' })
  @ArrayMinSize(1, { message: 'Informe ao menos uma congregação' })
  @IsInt({ each: true, message: 'Cada congregacaoId deve ser um número inteiro' })
  congregacaoIds?: number[];
}
